export const templateTypeTranslations = {
  main: "Principal",
  notification: "Notificação",
  delayed: "Atraso",
  paid: "Pagamento"
} as const;

export const subtemplateTypes = [
  {
    type: "notification" as const,
    title: "Template de Notificação",
    description: "Enviado quando uma nova cobrança é gerada",
    example: "Olá {nome}, sua fatura no valor de {valor} vence em {vencimento}."
  },
  {
    type: "delayed" as const,
    title: "Template de Atraso",
    description: "Enviado quando uma cobrança está atrasada",
    example: "Olá {nome}, sua fatura no valor de {valor} está vencida desde {vencimento}."
  },
  {
    type: "paid" as const,
    title: "Template de Pagamento",
    description: "Enviado quando um pagamento é confirmado",
    example: "Olá {nome}, confirmamos o pagamento da sua fatura no valor de {valor}."
  }
] as const;

export type TemplateType = keyof typeof templateTypeTranslations;
export type SubtemplateType = typeof subtemplateTypes[number]['type'];