import { PoolClient } from "pg";
import { consultar } from "../database/connection";
import { DadosEmprestimo, Emprestimo } from "../models/Emprestimo";

interface LinhaEmprestimo {
  id: number;
  livro_id: number;
  cliente_id: number;
  titulo_livro: string;
  nome_cliente: string;
  data_emprestimo: string;
  data_prevista_devolucao: string;
  data_devolucao: string | null;
}

const SELECT_EMPRESTIMOS = `
  SELECT e.id, e.livro_id, e.cliente_id,
         l.titulo AS titulo_livro,
         c.nome AS nome_cliente,
         TO_CHAR(e.data_emprestimo AT TIME ZONE 'America/Sao_Paulo', 'YYYY-MM-DD') AS data_emprestimo,
         TO_CHAR(e.data_prevista_devolucao, 'YYYY-MM-DD') AS data_prevista_devolucao,
         TO_CHAR(e.data_devolucao AT TIME ZONE 'America/Sao_Paulo', 'YYYY-MM-DD') AS data_devolucao
  FROM emprestimos e
  INNER JOIN livros l ON l.id = e.livro_id
  INNER JOIN clientes c ON c.id = e.cliente_id`;

function paraEmprestimo(linha: LinhaEmprestimo): Emprestimo {
  return new Emprestimo(
    linha.id,
    linha.livro_id,
    linha.cliente_id,
    linha.titulo_livro,
    linha.nome_cliente,
    linha.data_emprestimo,
    linha.data_prevista_devolucao,
    linha.data_devolucao,
  );
}

export class EmprestimoRepository {
  async listar(): Promise<Emprestimo[]> {
    const linhas = await consultar<LinhaEmprestimo>(`${SELECT_EMPRESTIMOS} ORDER BY e.data_emprestimo DESC`);
    return linhas.map(paraEmprestimo);
  }

  async listarAtivos(): Promise<Emprestimo[]> {
    const linhas = await consultar<LinhaEmprestimo>(
      `${SELECT_EMPRESTIMOS} WHERE e.data_devolucao IS NULL ORDER BY e.data_prevista_devolucao`,
    );
    return linhas.map(paraEmprestimo);
  }

  async buscarPorId(id: number): Promise<Emprestimo | null> {
    const [linha] = await consultar<LinhaEmprestimo>(`${SELECT_EMPRESTIMOS} WHERE e.id = $1`, [id]);
    return linha ? paraEmprestimo(linha) : null;
  }

  async criar(dados: DadosEmprestimo, conexao: PoolClient): Promise<number> {
    const [linha] = await consultar<{ id: number }>(
      `INSERT INTO emprestimos (livro_id, cliente_id, data_prevista_devolucao)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [dados.livroId, dados.clienteId, dados.dataPrevistaDevolucao],
      conexao,
    );
    return linha.id;
  }

  async registrarDevolucao(id: number, conexao: PoolClient): Promise<number | null> {
    const [linha] = await consultar<{ livro_id: number }>(
      `UPDATE emprestimos
       SET data_devolucao = NOW()
       WHERE id = $1 AND data_devolucao IS NULL
       RETURNING livro_id`,
      [id],
      conexao,
    );
    return linha ? linha.livro_id : null;
  }
}