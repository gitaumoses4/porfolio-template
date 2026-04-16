import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'

function revalidateSite() {
  try {
    revalidatePath('/', 'layout')
  } catch {
    // Called outside a request context (e.g. during seed/onInit) — safe to ignore
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = () => {
  revalidateSite()
}

export const revalidateAfterGlobalChange: GlobalAfterChangeHook = () => {
  revalidateSite()
}
