/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useCallback, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  Loader2,
  Upload,
} from "lucide-react"
import { useDropzone } from "react-dropzone"
import { useForm } from "react-hook-form"
import { read, utils } from "xlsx"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { hsskFormSchema } from "@/lib/validations/hssk"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

export function HSSKImportForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [progress, setProgress] = useState(0)

  const form = useForm<z.infer<typeof hsskFormSchema>>({
    resolver: zodResolver(hsskFormSchema),
    defaultValues: {
      startRow: 2,
    },
  })

  const onSubmit = async (values: z.infer<typeof hsskFormSchema>) => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    setProgress(0)

    try {
      const data = await readExcelFile(values.file)
      const selectedData = data.slice(
        values.startRow - 2,
        values.endRow ? values.endRow - 1 : undefined
      )
      await sendDataToAPI(selectedData)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const readExcelFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = read(data, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = utils.sheet_to_json(worksheet, { header: 1 })

        const headers = jsonData[0] as string[]

        const formattedData = jsonData.slice(1).map((row) => {
          const rowData: Record<string, any> = {}
          headers.forEach((header, index) => {
            rowData[header] = (row as any[])[index]
          })
          return rowData
        })

        resolve(formattedData)
      }
      reader.onerror = (error) => reject(error)
      reader.readAsArrayBuffer(file)
    })
  }

  const sendDataToAPI = async (data: any[]) => {
    // const apiEndpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/medical-record/medical-record/health-examination/create` // Replace with your actual API endpoint
    const chunkSize = 100 // Adjust this value based on your API's capacity
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize)
      // const response = await fetch(apiEndpoint, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(chunk),
      // })
      // if (!response.ok) {
      //   throw new Error(`API request failed with status ${response.status}`)
      // }

      console.log(chunk)
      setProgress(
        Math.min(100, Math.round(((i + chunkSize) / data.length) * 100))
      )
    }
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        form.setValue("file", acceptedFiles[0])
        form.clearErrors("file")
      }
    },
    [form]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: false,
  })

  return (
    <div className="w-full space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div
                    {...getRootProps()}
                    className={cn(
                      `cursor-pointer rounded-md border-2 border-dashed p-6 text-center transition-colors`,
                      isDragActive
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-ring"
                    )}
                  >
                    <Input {...getInputProps()} />
                    {field.value ? (
                      <div className="flex items-center justify-center">
                        <FileSpreadsheet className="mr-2 h-6 w-6 text-green-600" />
                        <p>{field.value.name}</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="mb-2 h-8 w-8 text-primary" />
                        <p>
                          Kéo và thả một tệp Excel vào đây hoặc nhấp để chọn một
                          tệp
                        </p>
                        <p className="text-sm text-muted-foreground">
                          (.xlsx hoặc .xls)
                        </p>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full gap-4">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="startRow"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hàng bắt đầu</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex-1">
              <FormField
                control={form.control}
                name="endRow"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hàng cuối (Tùy chọn)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? parseInt(e.target.value)
                              : undefined
                          )
                        }
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Bắt đầu nhập
          </Button>
        </form>
      </Form>

      {loading && <Progress value={progress} className="w-full" />}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Data has been successfully sent to the API.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
