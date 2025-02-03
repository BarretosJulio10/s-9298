import * as z from "zod";

export const chargeSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  document: z.string()
    .min(11, "CPF/CNPJ deve ter no mínimo 11 dígitos")
    .max(14, "CPF/CNPJ deve ter no máximo 14 dígitos"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  charge_amount: z.number().min(0.01, "Valor deve ser maior que zero"),
  charge_type: z.string().default("recurring"),
  payment_methods: z.array(z.string()).default(["pix"]),
  status: z.string().default("active"),
});

export type ChargeFormData = z.infer<typeof chargeSchema>;