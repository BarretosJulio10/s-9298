export interface Invoice {
  id: string;
  code: string;
  amount: number;
  status: "pendente" | "atrasado" | "pago";
  due_date: string;
  payment_date: string | null;
  client: {
    name: string;
    email: string;
    document: string;
    phone: string;
  };
}