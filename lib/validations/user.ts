import { z } from "zod"

export const userInfoSchema = z.object({
  doctorId: z.number(),
  doctorCode: z.string(),
  phoneNumber: z.string().nullable(),
  email: z.string().nullable(),
  avatar: z.string() || null,
  fullName: z.string(),
  userName: z.string(),
  provinceIdManage: z.string(),
  districtIdManage: z.string(),
  wardIdManage: z.string(),
  isUpdatedPassword: z.boolean(),
  workProvinceId: z.string(),
  workDistrictId: z.string(),
  workWardId: z.string(),
  healthfacilities: z.array(
    z.object({
      healthfacilitiesId: z.string(),
      nameVi: z.string(),
    })
  ),
})
