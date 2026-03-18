import { createPageAction } from '@/app/actions/pages'
import { PageForm } from '../PageForm'

export default function NewPagePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Add Page</h1>
      <PageForm action={createPageAction} />
    </div>
  )
}
