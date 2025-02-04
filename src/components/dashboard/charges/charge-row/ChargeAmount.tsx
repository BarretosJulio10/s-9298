interface ChargeAmountProps {
  amount: number;
}

export function ChargeAmount({ amount }: ChargeAmountProps) {
  return (
    <span className="font-medium">
      {new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount)}
    </span>
  );
}