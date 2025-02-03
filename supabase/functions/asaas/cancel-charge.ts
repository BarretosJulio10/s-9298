import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface RequestBody {
  apiKey: string;
  environment: "sandbox" | "production";
  chargeId: string;
}

serve(async (req) => {
  try {
    const { apiKey, environment, chargeId } = await req.json() as RequestBody;

    const baseUrl = environment === "production"
      ? "https://api.asaas.com"
      : "https://sandbox.asaas.com/api/v3";

    const response = await fetch(`${baseUrl}/payments/${chargeId}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access_token": apiKey,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return new Response(
        JSON.stringify({ message: error.message || "Erro ao cancelar cobrança" }),
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