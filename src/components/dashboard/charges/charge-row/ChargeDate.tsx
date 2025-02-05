import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ChargeDateProps {
  date: string | null;
  label?: string;
}

export function ChargeDate({ date, label = "-" }: ChargeDateProps) {
  if (!date) return <span>{label}</span>;

  return (
    <span>
      {format(new Date(date), "dd/MM/yyyy", {
        locale: ptBR,
      })}
    </span>
  );
}