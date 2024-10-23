"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"

import { excelSchema, type ExcelForm } from "@/lib/schemas"
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

interface ExcelFormProps {
  onSubmit: (values: ExcelForm) => Promise<void>
  isLoading: boolean
}

export function ExcelForm({ onSubmit, isLoading }: ExcelFormProps) {
  const form = useForm<ExcelForm>({
    resolver: zodResolver(excelSchema),
    defaultValues: {
      filePath: "",
      startRow: 1,
      endRow: 1,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="filePath"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excel File Path</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  placeholder="Enter the file path"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startRow"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Row</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endRow"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Row</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Process Excel
        </Button>
      </form>
    </Form>
  )
}
