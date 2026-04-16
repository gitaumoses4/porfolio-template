'use client'

import { useState, useTransition } from 'react'
import { Button, Input, Textarea } from '@heroui/react'
import { submitRecommendation } from '@/actions/recommendations'
import Link from 'next/link'

interface RecommendationFormProps {
  onSuccess?: () => void
}

export function RecommendationForm({ onSuccess }: RecommendationFormProps) {
  const [isPending, startTransition] = useTransition()
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [messageLength, setMessageLength] = useState(0)

  if (submitted) {
    return (
      <div className="border-l-2 border-primary/30 pl-5 py-4">
        <p className="font-serif text-lg italic text-foreground mb-2">
          Thanks for your recommendation!
        </p>
        <p className="font-sans text-sm text-default-500">
          It will appear on the site after review.
        </p>
        {onSuccess && (
          <Button
            color="primary"
            variant="solid"
            className="mt-4"
            onPress={() => onSuccess()}
          >
            Done
          </Button>
        )}
      </div>
    )
  }

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await submitRecommendation({
        name: formData.get('name') as string,
        title: formData.get('title') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        relationship: formData.get('relationship') as string,
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
        name="title"
        label="Your Title"
        placeholder="Engineering Manager, Acme Corp"
        isRequired
        variant="bordered"
      />
      <Input
        name="email"
        label="Email"
        type="email"
        placeholder="jane@example.com"
        variant="bordered"
      />
      <Input
        name="phone"
        label="Phone"
        type="tel"
        placeholder="+1 (555) 123-4567"
        variant="bordered"
      />
      <Input
        name="relationship"
        label="How do you know me?"
        placeholder="Worked together at Microsoft"
        variant="bordered"
      />
      <div>
        <Textarea
          name="message"
          label="Your recommendation"
          placeholder="What was it like working with me?"
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
        Submit Recommendation
      </Button>

      <Link href="/privacy" className="text-xs text-default-500">Privacy Policy</Link>
    </form>
  )
}
