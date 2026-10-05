import { consultar } from "../database/connection";
import {
  ClienteComEmprestimoAtivo,
  EmprestimosPorLivro,
  LivroDisponivel,
  LivroEmprestado,
  LivrosPorAutor,
} from "../models/Relatorios";

export class RelatorioRepository {
  livrosDisponiveis(): Promise<LivroDisponivel[]> {
    return consultar<LivroDisponivel>(
      `SELECT l.titulo, a.nome AS autor, l.quantidade_disponivel AS disponiveis
       FROM livros l
       INNER JOIN autores a ON a.id = l.autor_id
       WHERE l.quantidade_disponivel > 0
       ORDER BY l.titulo`,
    );
  }

  livrosEmprestados(): Promise<LivroEmprestado[]> {
    return consultar<LivroEmprestado>(
      `SELECT l.titulo,
              c.nome AS cliente,
              TO_CHAR(e.data_emprestimo AT TIME ZONE 'America/Sao_Paulo', 'YYYY-MM-DD') AS "dataEmprestimo",
              TO_CHAR(e.data_prevista_devolucao, 'YYYY-MM-DD') AS "dataPrevistaDevolucao"
       FROM emprestimos e
       INNER JOIN livros l ON l.id = e.livro_id
       INNER JOIN clientes c ON c.id = e.cliente_id
       WHERE e.data_devolucao IS NULL
       ORDER BY e.data_prevista_devolucao`,
    );
  }

  livrosPorAutor(): Promise<LivrosPorAutor[]> {
    return consultar<LivrosPorAutor>(
      `SELECT a.nome AS autor,
              COUNT(l.id)::int AS "totalLivros",
              COALESCE(SUM(l.quantidade_total), 0)::int AS "totalExemplares"
       FROM autores a
       LEFT JOIN livros l ON l.autor_id = a.id
       GROUP BY a.id, a.nome
       ORDER BY "totalLivros" DESC, a.nome`,
    );
  }

  emprestimosPorLivro(): Promise<EmprestimosPorLivro[]> {
    return consultar<EmprestimosPorLivro>(
      `SELECT l.titulo, COUNT(e.id)::int AS "totalEmprestimos"
       FROM livros l
       LEFT JOIN emprestimos e ON e.livro_id = l.id
       GROUP BY l.id, l.titulo
       ORDER BY "totalEmprestimos" DESC, l.titulo
       LIMIT 5`,
    );
  }

  clientesComEmprestimoAtivo(): Promise<ClienteComEmprestimoAtivo[]> {
    return consultar<ClienteComEmprestimoAtivo>(
      `SELECT c.nome AS cliente, c.email, COUNT(e.id)::int AS "emprestimosAtivos"
       FROM clientes c
       INNER JOIN emprestimos e ON e.cliente_id = c.id
       WHERE e.data_devolucao IS NULL
       GROUP BY c.id, c.nome, c.email
       ORDER BY "emprestimosAtivos" DESC, c.nome`,
    );
  }
}