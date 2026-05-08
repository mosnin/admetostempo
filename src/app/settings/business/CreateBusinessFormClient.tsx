'use client'

import { useRouter } from 'next/navigation'
import { CreateBusinessForm } from '@/components/business/CreateBusinessForm'

export function CreateBusinessFormClient() {
  const router = useRouter()

  function handleSuccess(username: string) {
    router.push('/settings/business/products')
  }

  return <CreateBusinessForm onSuccess={handleSuccess} />
}
