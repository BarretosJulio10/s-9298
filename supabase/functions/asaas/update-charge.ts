import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface RequestBody {
  apiKey: string;
  environment: "sandbox" | "production";
  chargeId: string;
  charge: {
    customer: {
      name: string;
      email: string;
      cpfCnpj: string;
    };
    value: number;
    dueDate: string;
  };
}

serve(async (req) => {
  try {
    const { apiKey, environment, chargeId, charge } = await req.json() as RequestBody;

    const baseUrl = environment === "production"
      ? "https://api.asaas.com"
      : "https://sandbox.asaas.com/api/v3";

    const response = await fetch(`${baseUrl}/payments/${chargeId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access_token": apiKey,
      },
      body: JSON.stringify({
        customer: charge.customer,
        value: charge.value,
        dueDate: charge.dueDate,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return new Response(
        JSON.stringify({ message: error.message || "Erro ao atualizar cobrança" }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: error.message || "Erro interno do servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});