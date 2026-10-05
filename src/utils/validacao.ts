const FORMATO_DATA = /^\d{4}-\d{2}-\d{2}$/;

export function hojeEmSaoPaulo(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());
}

export function somenteDigitos(valor: string): string {
  return valor.replace(/\D/g, "");
}

export function validarTextoObrigatorio(valor: string, campo: string): string | null {
  return valor.trim().length >= 3 ? null : `${campo} deve ter pelo menos 3 caracteres.`;
}

export function validarData(valor: string): string | null {
  if (!FORMATO_DATA.test(valor)) {
    return "Use o formato AAAA-MM-DD.";
  }
  const [ano, mes, dia] = valor.split("-").map(Number);
  const data = new Date(Date.UTC(ano, mes - 1, dia));
  const existe =
    data.getUTCFullYear() === ano && data.getUTCMonth() === mes - 1 && data.getUTCDate() === dia;
  return existe ? null : "Data inexistente.";
}

export function validarDataNascimento(valor: string): string | null {
  const erro = validarData(valor);
  if (erro) {
    return erro;
  }
  return valor > hojeEmSaoPaulo() ? "A data de nascimento não pode ser futura." : null;
}

export function validarDataDevolucaoPrevista(valor: string): string | null {
  const erro = validarData(valor);
  if (erro) {
    return erro;
  }
  return valor < hojeEmSaoPaulo() ? "A devolução prevista não pode ser anterior a hoje." : null;
}

export function validarIsbn(valor: string): string | null {
  const digitos = somenteDigitos(valor);
  return digitos.length === 10 || digitos.length === 13 ? null : "O ISBN deve ter 10 ou 13 dígitos.";
}

export function validarAnoPublicacao(ano: number): string | null {
  const anoAtual = Number(hojeEmSaoPaulo().slice(0, 4));
  return Number.isInteger(ano) && ano >= 1450 && ano <= anoAtual
    ? null
    : `O ano deve estar entre 1450 e ${anoAtual}.`;
}

export function validarQuantidade(quantidade: number): string | null {
  return Number.isInteger(quantidade) && quantidade > 0
    ? null
    : "A quantidade deve ser um número inteiro maior que zero.";
}

export function validarEmail(valor: string): string | null {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim()) ? null : "E-mail inválido.";
}

export function validarCpf(valor: string): string | null {
  const cpf = somenteDigitos(valor);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return "CPF inválido.";
  }
  const digitos = cpf.split("").map(Number);
  for (const posicao of [9, 10]) {
    const soma = digitos
      .slice(0, posicao)
      .reduce((total, digito, indice) => total + digito * (posicao + 1 - indice), 0);
    const verificador = ((soma * 10) % 11) % 10;
    if (verificador !== digitos[posicao]) {
      return "CPF inválido.";
    }
  }
  return null;
}

export function validarTelefone(valor: string): string | null {
  const digitos = somenteDigitos(valor);
  return digitos.length === 10 || digitos.length === 11
    ? null
    : "O telefone deve ter DDD e 10 ou 11 dígitos.";
}

export function validarId(id: number): string | null {
  return Number.isInteger(id) && id > 0 ? null : "O código deve ser um número inteiro maior que zero.";
}