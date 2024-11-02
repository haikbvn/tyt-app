import { HSSKImportForm } from "@/components/hssk-import-form"
import { PageHeader } from "@/components/page-header"

export default function HsskImport() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col">
      <div className="space-y-6">
        <PageHeader
          heading="Nhập lịch sử khám"
          text="Nhập lịch sử khám bệnh bằng file excel."
        />
        <HSSKImportForm />
      </div>
    </div>
  )
}
