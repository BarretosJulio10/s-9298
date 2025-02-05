interface ChargeCustomerProps {
  name: string;
  email: string;
}

export function ChargeCustomer({ name, email }: ChargeCustomerProps) {
  return (
    <div>
      <p className="font-medium">{name}</p>
      <p className="text-sm text-muted-foreground">{email}</p>
    </div>
  );
}