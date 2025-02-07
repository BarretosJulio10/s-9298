
export const WAPI_ENDPOINT = "https://api.wapi.com.br";

export const endpoints = {
  createInstance: `${WAPI_ENDPOINT}/manager/create`,
  deleteInstance: `${WAPI_ENDPOINT}/api/instance/logout`,
  getQRCode: `${WAPI_ENDPOINT}/manager/qrcode`,
  getStatus: `${WAPI_ENDPOINT}/api/instance/status`,
  sendMessage: `${WAPI_ENDPOINT}/messages/text`
};
