'use server'

import { payload } from '@/lib/payload'
import type { Recommendation } from '@payload-types'
import { sendRecommendationNotification } from '@/lib/email'

export async function getApprovedRecommendations(): Promise<Recommendation[]> {
  const { docs } = await payload.find({
    collection: 'recommendations',
    where: { status: { equals: 'approved' } },
    sort: '-featured,-createdAt',
    depth: 1,
    limit: 20,
  })
  return docs
}

export async function submitRecommendation(data: {
  name: string
  title: string
  email?: string
  phone?: string
  relationship?: string
  message: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    if (!data.name?.trim() || !data.title?.trim() || !data.message?.trim()) {
      return { success: false, error: 'Name, title, and message are required.' }
    }
    if (data.message.length > 1000) {
      return { success: false, error: 'Message must be 1000 characters or fewer.' }
    }

    const trimmed = {
      name: data.name.trim(),
      title: data.title.trim(),
      email: data.email?.trim() || undefined,
      phone: data.phone?.trim() || undefined,
      relationship: data.relationship?.trim() || undefined,
      message: data.message.trim(),
    }

    await payload.create({
      collection: 'recommendations',
      data: trimmed,
    })

    // Send notification (fire and forget — don't block the response)
    sendRecommendationNotification(trimmed).catch(() => {})

    return { success: true }
  } catch {
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}
