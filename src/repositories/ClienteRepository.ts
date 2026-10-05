import { consultar } from "../database/connection";
import { Cliente, DadosCliente } from "../models/Cliente";
import { traduzirErroBanco } from "../utils/erros";

interface LinhaCliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
}

const COLUNAS = "id, nome, email, telefone, cpf";

function paraCliente(linha: LinhaCliente): Cliente {
  return new Cliente(linha.id, linha.nome, linha.email, linha.telefone, linha.cpf);
}

export class ClienteRepository {
  async listar(): Promise<Cliente[]> {
    const linhas = await consultar<LinhaCliente>(`SELECT ${COLUNAS} FROM clientes ORDER BY nome`);
    return linhas.map(paraCliente);
  }

  async buscarPorId(id: number): Promise<Cliente | null> {
    const [linha] = await consultar<LinhaCliente>(`SELECT ${COLUNAS} FROM clientes WHERE id = $1`, [id]);
    return linha ? paraCliente(linha) : null;
  }

  async criar(dados: DadosCliente): Promise<Cliente> {
    try {
      const [linha] = await consultar<LinhaCliente>(
        `INSERT INTO clientes (nome, email, telefone, cpf)
         VALUES ($1, $2, $3, $4)
         RETURNING ${COLUNAS}`,
        [dados.nome, dados.email, dados.telefone, dados.cpf],
      );
      return paraCliente(linha);
    } catch (erro) {
      return traduzirErroBanco(erro);
    }
  }

  async atualizar(id: number, dados: DadosCliente): Promise<Cliente | null> {
    try {
      const [linha] = await consultar<LinhaCliente>(
        `UPDATE clientes
         SET nome = $1, email = $2, telefone = $3, cpf = $4
         WHERE id = $5
         RETURNING ${COLUNAS}`,
        [dados.nome, dados.email, dados.telefone, dados.cpf, id],
      );
      return linha ? paraCliente(linha) : null;
    } catch (erro) {
      return traduzirErroBanco(erro);
    }
  }

  async remover(id: number): Promise<void> {
    try {
      await consultar("DELETE FROM clientes WHERE id = $1", [id]);
    } catch (erro) {
      traduzirErroBanco(erro);
    }
  }

  async possuiEmprestimos(id: number): Promise<boolean> {
    const [linha] = await consultar<{ existe: boolean }>(
      "SELECT EXISTS (SELECT 1 FROM emprestimos WHERE cliente_id = $1) AS existe",
      [id],
    );
    return linha.existe;
  }
}
