export function useDocumentValidation() {
  const validateCPF = (cpf: string) => {
    cpf = cpf.replace(/[^\d]/g, '');
    
    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(10))) return false;
    
    return true;
  };

  const validateCNPJ = (cnpj: string) => {
    cnpj = cnpj.replace(/[^\d]/g, '');
    
    if (cnpj.length !== 14) return false;
    if (/^(\d)\1+$/.test(cnpj)) return false;
    
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(0))) return false;
    
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(1))) return false;
    
    return true;
  };

  const generateValidCPF = () => {
    const numbers = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += numbers[i] * (10 - i);
    }
    const digit1 = 11 - (sum % 11);
    numbers.push(digit1 >= 10 ? 0 : digit1);
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += numbers[i] * (11 - i);
    }
    const digit2 = 11 - (sum % 11);
    numbers.push(digit2 >= 10 ? 0 : digit2);
    
    const cpf = numbers.join('');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const generateValidCNPJ = () => {
    const numbers = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10));
    
    let soma = 0;
    let multiplicador = 5;
    for (let i = 0; i < 12; i++) {
      soma += numbers[i] * multiplicador;
      multiplicador = multiplicador === 2 ? 9 : multiplicador - 1;
    }
    const digit1 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    numbers.push(digit1);
    
    soma = 0;
    multiplicador = 6;
    for (let i = 0; i < 13; i++) {
      soma += numbers[i] * multiplicador;
      multiplicador = multiplicador === 2 ? 9 : multiplicador - 1;
    }
    const digit2 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    numbers.push(digit2);
    
    const cnpj = numbers.join('');
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  return {
    validateCPF,
    validateCNPJ,
    generateValidCPF,
    generateValidCNPJ,
  };
}