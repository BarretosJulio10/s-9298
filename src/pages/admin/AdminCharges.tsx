import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { ChargesList } from "@/components/admin/charges/ChargesList";
import { ChargeForm } from "@/components/admin/charges/ChargeForm";

export default function AdminCharges() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cobranças</h2>
          <p className="text-muted-foreground">
            Gerencie todas as cobranças do sistema
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Cobrança
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Criar Nova Cobrança</DialogTitle>
            </DialogHeader>
            <ChargeForm />
          </DialogContent>
        </Dialog>
      </div>

      <ChargesList />
    </div>
  );
}