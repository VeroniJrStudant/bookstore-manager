export class ErroDeNegocio extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = "ErroDeNegocio";
  }
}

interface ErroPostgres {
  code?: string;
  constraint?: string;
}

function ehErroPostgres(erro: unknown): erro is ErroPostgres {
  return typeof erro === "object" && erro !== null && "code" in erro;
}

const MENSAGENS_DUPLICIDADE: Record<string, string> = {
  livros_isbn_key: "Já existe um livro com este ISBN.",
  clientes_email_key: "Já existe um cliente com este e-mail.",
  clientes_cpf_key: "Já existe um cliente com este CPF.",
};

export function traduzirErroBanco(erro: unknown): never {
  if (ehErroPostgres(erro)) {
    if (erro.code === "23505") {
      throw new ErroDeNegocio(MENSAGENS_DUPLICIDADE[erro.constraint ?? ""] ?? "Registro duplicado.");
    }
    if (erro.code === "23503") {
      throw new ErroDeNegocio("Operação não permitida: o registro está vinculado a outro cadastro.");
    }
  }
  throw erro;
}

export function mensagemDeErro(erro: unknown): string {
  if (erro instanceof ErroDeNegocio) {
    return erro.message;
  }
  if (ehErroPostgres(erro) && erro.code === "ECONNREFUSED") {
    return "Não foi possível acessar o banco. Confira o .env e se o PostgreSQL está ligado.";
  }
  if (erro instanceof Error) {
    return `Erro inesperado: ${erro.message}`;
  }
  return "Erro inesperado.";
}
