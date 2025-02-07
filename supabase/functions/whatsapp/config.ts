
export const WAPI_ENDPOINT = "https://api.wapi.com.br";

export const getHeaders = async (supabase: any, companyId: string) => {
  const { data: settings, error } = await supabase
    .from('whatsapp_api_settings')
    .select('wapi_token')
    .eq('company_id', companyId)
    .single();

  if (error) {
    console.error("Erro ao buscar configurações da W-API:", error);
    throw new Error("Erro ao buscar configurações do WhatsApp");
  }

  if (!settings?.wapi_token) {
    throw new Error("Token W-API não configurado");
  }

  return {
    "Authorization": `Bearer ${settings.wapi_token}`,
    "Content-Type": "application/json"
  };
};

export const endpoints = {
  createInstance: `${WAPI_ENDPOINT}/manager/create`,
  deleteInstance: `${WAPI_ENDPOINT}/api/instance/logout`,
  getQRCode: `${WAPI_ENDPOINT}/manager/qrcode`,
  getStatus: `${WAPI_ENDPOINT}/api/instance/status`,
  sendMessage: `${WAPI_ENDPOINT}/messages/text`
};
