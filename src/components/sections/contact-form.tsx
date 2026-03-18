'use client'

import { useState, useTransition } from 'react'
import { Button, Input, Textarea } from '@heroui/react'
import { submitContactForm } from '@/actions/contact'

export function ContactForm() {
  const [isPending, startTransition] = useTransition()
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [messageLength, setMessageLength] = useState(0)

  if (submitted) {
    return (
      <div className="border-l-2 border-primary/30 pl-5 py-4">
        <p className="font-serif text-lg italic text-foreground mb-2">
          Thanks for reaching out!
        </p>
        <p className="font-sans text-sm text-default-500">
          I&apos;ll get back to you soon.
        </p>
      </div>
    )
  }

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await submitContactForm({
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        message: formData.get('message') as string,
      })
      if (result.success) {
        setSubmitted(true)
      } else {
        setError(result.error ?? 'Something went wrong.')
      }
    })
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-5 max-w-xl">
      <Input
        name="name"
        label="Name"
        placeholder="Jane Doe"
        isRequired
        variant="bordered"
      />
      <Input
        name="email"
        label="Email"
        type="email"
        placeholder="jane@example.com"
        isRequired
        variant="bordered"
      />
      <div>
        <Textarea
          name="message"
          label="Message"
          placeholder="What would you like to discuss?"
          isRequired
          maxLength={1000}
          variant="bordered"
          minRows={4}
          onChange={(e) => setMessageLength(e.target.value.length)}
        />
        <span className="font-mono text-[11px] text-default-400 mt-1 block text-right">
          {messageLength}/1000
        </span>
      </div>

      {error && (
        <p className="font-sans text-sm text-danger">{error}</p>
      )}

      <Button
        type="submit"
        color="primary"
        isLoading={isPending}
        className="self-start"
      >
        Send Message
      </Button>
    </form>
  )
}
