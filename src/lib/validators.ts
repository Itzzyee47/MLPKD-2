import { z } from "zod";

export const roleSchema = z.enum(["doctor", "nurse", "lab_tech", "patient"]);

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const registerSchema = authSchema.extend({
  username: z.string().min(3),
  full_name: z.string().min(2),
  sex: z.enum(["male", "female", "other"]),
  address: z.string().min(5).max(300),
  role: roleSchema,
});

export const clinicalSchema = z.object({
  age: z.coerce.number().min(1).max(120),
  bp: z.coerce.number().min(40).max(280),
  sg: z.coerce.number().min(1.0).max(1.03),
  al: z.coerce.number().min(0).max(5),
  su: z.coerce.number().min(0).max(5),
  rbc: z.enum(["normal", "abnormal"]),
  pc: z.enum(["normal", "abnormal"]),
  pcc: z.enum(["present", "notpresent"]),
  ba: z.enum(["present", "notpresent"]),
  bgr: z.coerce.number().min(20).max(500),
  bu: z.coerce.number().min(1).max(300),
  sc: z.coerce.number().min(0.1).max(20),
  sod: z.coerce.number().min(90).max(180),
  pot: z.coerce.number().min(1).max(10),
  hemo: z.coerce.number().min(2).max(20),
  pcv: z.coerce.number().min(10).max(60),
  wc: z.coerce.number().min(1000).max(60000),
  rc: z.coerce.number().min(1).max(8),
  htn: z.enum(["yes", "no"]),
  dm: z.enum(["yes", "no"]),
  cad: z.enum(["yes", "no"]),
  appet: z.enum(["good", "poor"]),
  pe: z.enum(["yes", "no"]),
  ane: z.enum(["yes", "no"]),
});

export const predictionSchema = z.object({
  patient_id: z.string().uuid(),
}).merge(clinicalSchema);

export const vitalsSchema = z.object({
  patient_id: z.string().uuid(),
  notes: z.string().max(400).optional(),
}).merge(clinicalSchema);

export const labSchema = z.object({
  patient_id: z.string().uuid(),
  notes: z.string().max(400).optional(),
}).merge(clinicalSchema);
