import Link from "next/link"

import { PageHeader } from "@/components/page-header"

export default function HsskImport() {
  return (
    <div className="flex max-w-2xl flex-col">
      <div className="space-y-6">
        <PageHeader title="HSSK Import" />
        <Link href="/">Home</Link>
      </div>
    </div>
  )
}
