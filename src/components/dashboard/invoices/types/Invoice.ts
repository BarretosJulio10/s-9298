export interface Invoice {
  id: string;
  code: string;
  amount: number;
  status: string;
  due_date: string;
  payment_date: string | null;
  client: {
    name: string;
    email: string;
    document: string;
    phone: string;
  };
}