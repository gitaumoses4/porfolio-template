'use server'

import { payload } from '@/lib/payload'
import { sendContactNotification } from '@/lib/email'

export async function submitContactForm(data: {
  name: string
  email: string
  message: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    if (!data.name?.trim() || !data.email?.trim() || !data.message?.trim()) {
      return { success: false, error: 'Name, email, and message are required.' }
    }
    if (data.message.length > 1000) {
      return { success: false, error: 'Message must be 1000 characters or fewer.' }
    }

    const trimmed = {
      name: data.name.trim(),
      email: data.email.trim(),
      message: data.message.trim(),
    }

    await payload.create({
      collection: 'contact-submissions',
      data: trimmed,
    })

    // Send notification (fire and forget — don't block the response)
    sendContactNotification(trimmed).catch(() => {})

    return { success: true }
  } catch {
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}
