
export const WAPI_ENDPOINT = "https://api.wapi.com.br";
export const DEFAULT_TOKEN = '1716319589869x721327290780988000'; // Token W-API

export const headers = {
  "Authorization": `Bearer ${DEFAULT_TOKEN}`,
  "Content-Type": "application/json"
};

export const endpoints = {
  createInstance: `${WAPI_ENDPOINT}/manager/create`,
  deleteInstance: `${WAPI_ENDPOINT}/api/instance/logout`,
  getQRCode: `${WAPI_ENDPOINT}/manager/qrcode`,
  getStatus: `${WAPI_ENDPOINT}/api/instance/status`,
  sendMessage: `${WAPI_ENDPOINT}/messages/text`
};
