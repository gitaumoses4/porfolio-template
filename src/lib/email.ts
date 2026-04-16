import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendRecommendationNotification(data: {
  name: string
  title: string
  email?: string
  phone?: string
  relationship?: string
  message: string
}) {
  const notifyEmail = process.env.NOTIFICATION_EMAIL
  const templateId = process.env.RESEND_RECOMMENDATION_TEMPLATE_ID
  if (!notifyEmail || !process.env.RESEND_API_KEY || !templateId) return

  await resend.emails.send({
    to: notifyEmail,
    template: {
      id: templateId,
      variables: {
        name: data.name,
        title: data.title,
        email: data.email || '',
        phone: data.phone || '',
        relationship: data.relationship || '',
        message: data.message,
        serverUrl: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
      },
    },
  })
}

export async function sendContactNotification(data: {
  name: string
  email: string
  message: string
}) {
  const notifyEmail = process.env.NOTIFICATION_EMAIL
  if (!notifyEmail || !process.env.RESEND_API_KEY) return

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  await resend.emails.send({
    from: 'Portfolio Contact <onboarding@resend.dev>',
    to: notifyEmail,
    subject: `New contact form submission from ${data.name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
      <p><strong>Message:</strong></p>
      <blockquote style="border-left: 3px solid #ccc; padding-left: 12px; color: #555;">
        ${data.message.replace(/\n/g, '<br>')}
      </blockquote>
      <hr>
      <p style="font-size: 12px; color: #999;">
        Sent from <a href="${serverUrl}">${serverUrl}</a>
      </p>
    `,
  })
}
