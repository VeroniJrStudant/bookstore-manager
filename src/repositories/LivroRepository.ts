import { consultar } from "../database/connection";
import { DadosLivro, Livro } from "../models/Livro";
import { traduzirErroBanco } from "../utils/erros";

interface LinhaLivro {
  id: number;
  titulo: string;
  isbn: string;
  ano_publicacao: number;
  quantidade_total: number;
  quantidade_disponivel: number;
  autor_id: number;
  nome_autor: string;
}

const SELECT_LIVROS = `
  SELECT l.id, l.titulo, l.isbn, l.ano_publicacao, l.quantidade_total,
         l.quantidade_disponivel, l.autor_id, a.nome AS nome_autor
  FROM livros l
  INNER JOIN autores a ON a.id = l.autor_id`;

function paraLivro(linha: LinhaLivro): Livro {
  return new Livro(
    linha.id,
    linha.titulo,
    linha.isbn,
    linha.ano_publicacao,
    linha.quantidade_total,
    linha.quantidade_disponivel,
    linha.autor_id,
    linha.nome_autor,
  );
}

export class LivroRepository {
  async listar(): Promise<Livro[]> {
    const linhas = await consultar<LinhaLivro>(`${SELECT_LIVROS} ORDER BY l.titulo`);
    return linhas.map(paraLivro);
  }

  async buscarPorId(id: number): Promise<Livro | null> {
    const [linha] = await consultar<LinhaLivro>(`${SELECT_LIVROS} WHERE l.id = $1`, [id]);
    return linha ? paraLivro(linha) : null;
  }

  async criar(dados: DadosLivro): Promise<number> {
    try {
      const [linha] = await consultar<{ id: number }>(
        `INSERT INTO livros (titulo, isbn, ano_publicacao, quantidade_total, quantidade_disponivel, autor_id)
         VALUES ($1, $2, $3, $4, $4, $5)
         RETURNING id`,
        [dados.titulo, dados.isbn, dados.anoPublicacao, dados.quantidadeTotal, dados.autorId],
      );
      return linha.id;
    } catch (erro) {
      return traduzirErroBanco(erro);
    }
  }

  async atualizar(id: number, dados: DadosLivro): Promise<void> {
    try {
      await consultar(
        `UPDATE livros
         SET titulo = $1,
             isbn = $2,
             ano_publicacao = $3,
             quantidade_disponivel = quantidade_disponivel + ($4 - quantidade_total),
             quantidade_total = $4,
             autor_id = $5
         WHERE id = $6`,
        [dados.titulo, dados.isbn, dados.anoPublicacao, dados.quantidadeTotal, dados.autorId, id],
      );
    } catch (erro) {
      traduzirErroBanco(erro);
    }
  }

  async remover(id: number): Promise<void> {
    try {
      await consultar("DELETE FROM livros WHERE id = $1", [id]);
    } catch (erro) {
      traduzirErroBanco(erro);
    }
  }

  async possuiEmprestimos(id: number): Promise<boolean> {
    const [linha] = await consultar<{ existe: boolean }>(
      "SELECT EXISTS (SELECT 1 FROM emprestimos WHERE livro_id = $1) AS existe",
      [id],
    );
    return linha.existe;
  }
}