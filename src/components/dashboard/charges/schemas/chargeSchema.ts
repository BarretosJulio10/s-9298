import * as z from "zod";

export const chargeSchema = z.object({
  customer_name: z.string().min(1, "Nome é obrigatório"),
  customer_email: z.string().email("E-mail inválido"),
  customer_document: z.string()
    .min(11, "CPF/CNPJ deve ter no mínimo 11 dígitos")
    .max(14, "CPF/CNPJ deve ter no máximo 14 dígitos"),
  amount: z.number().min(0.01, "Valor deve ser maior que zero"),
  due_date: z.string().min(1, "Data de vencimento é obrigatória"),
});

export type ChargeFormData = z.infer<typeof chargeSchema>;