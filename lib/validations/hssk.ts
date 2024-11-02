import * as z from "zod"

export const hsskFormSchema = z.object({
  file: z
    .custom<File>((v) => v instanceof File, {
      message: "Vui lòng chọn một tập tin",
    })
    .refine(
      (file) => file.name.endsWith(".xlsx") || file.name.endsWith(".xls"),
      {
        message: "Tệp phải là tài liệu Excel (.xlsx hoặc .xls)",
      }
    ),
  startRow: z.number().min(2, { message: "Hàng bắt đầu ít nhất là 2" }),
  endRow: z
    .number()
    .min(2, {
      message: "Hàng cuối phải có ít nhất 2 và lớn hơn hoặc bằng hàng bắt đầu",
    })
    .optional(),
})
