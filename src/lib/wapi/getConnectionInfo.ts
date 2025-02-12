
import { WHATSAPP_CONFIG } from "@/config/whatsapp";
import { WAPI_ENDPOINT, WAPI_ID_ADM } from "./config";

export async function getConnectionInfo(connectionKey: string): Promise<{ instancia: string; status: string }> {
  try {
    const response = await fetch(
      `${WAPI_ENDPOINT}/instance/info?connectionKey=${connectionKey}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Authorization, Content-Type, Accept',
          'Cache-Control': 'no-cache'
        },
        mode: 'cors',
        credentials: 'omit'
      }
    );

    if (!response.ok) {
      throw new Error('Falha ao obter informações da conexão');
    }

    const data = await response.json();
    console.log('Resposta da API:', data);

    return {
      instancia: data.instancia || '',
      status: data.status || 'Desconectado'
    };
  } catch (error) {
    console.error('Erro ao obter informações da conexão:', error);
    throw error;
  }
}
