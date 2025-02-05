export const useWhatsAppValidation = () => {
  const validateWhatsApp = async (phone: string): Promise<boolean> => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 11) return false;
    if (cleanPhone[2] !== '9') return false;
    const ddd = parseInt(cleanPhone.substring(0, 2));
    if (ddd < 11 || ddd > 99) return false;
    return true;
  };

  return { validateWhatsApp };
};