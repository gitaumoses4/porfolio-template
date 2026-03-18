'use client'

import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/react'
import { useRecommendationModal } from '@/contexts/RecommendationModalContext'
import { RecommendationForm } from '@/components/sections/recommendation-form'

export function RecommendationModal() {
  const { isOpen, onOpenChange } = useRecommendationModal()

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <span className="font-sans text-lg font-semibold">Leave a recommendation</span>
          <span className="font-sans text-sm text-default-500 font-normal">
            Your recommendation will appear on the site after review.
          </span>
        </ModalHeader>
        <ModalBody className="pb-6">
          <RecommendationForm onSuccess={() => onOpenChange(false)} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
