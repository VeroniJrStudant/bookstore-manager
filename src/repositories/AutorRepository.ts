import { consultar } from "../database/connection";
import { Autor, DadosAutor } from "../models/Autor";
import { traduzirErroBanco } from "../utils/erros";

interface LinhaAutor {
  id: number;
  nome: string;
  nacionalidade: string;
  data_nascimento: string | null;
}

const COLUNAS = "id, nome, nacionalidade, TO_CHAR(data_nascimento, 'YYYY-MM-DD') AS data_nascimento";

function paraAutor(linha: LinhaAutor): Autor {
  return new Autor(linha.id, linha.nome, linha.nacionalidade, linha.data_nascimento);
}

export class AutorRepository {
  async listar(): Promise<Autor[]> {
    const linhas = await consultar<LinhaAutor>(`SELECT ${COLUNAS} FROM autores ORDER BY nome`);
    return linhas.map(paraAutor);
  }

  async buscarPorId(id: number): Promise<Autor | null> {
    const [linha] = await consultar<LinhaAutor>(`SELECT ${COLUNAS} FROM autores WHERE id = $1`, [id]);
    return linha ? paraAutor(linha) : null;
  }

  async criar(dados: DadosAutor): Promise<Autor> {
    const [linha] = await consultar<LinhaAutor>(
      `INSERT INTO autores (nome, nacionalidade, data_nascimento)
       VALUES ($1, $2, $3)
       RETURNING ${COLUNAS}`,
      [dados.nome, dados.nacionalidade, dados.dataNascimento],
    );
    return paraAutor(linha);
  }

  async atualizar(id: number, dados: DadosAutor): Promise<Autor | null> {
    const [linha] = await consultar<LinhaAutor>(
      `UPDATE autores
       SET nome = $1, nacionalidade = $2, data_nascimento = $3
       WHERE id = $4
       RETURNING ${COLUNAS}`,
      [dados.nome, dados.nacionalidade, dados.dataNascimento, id],
    );
    return linha ? paraAutor(linha) : null;
  }

  async remover(id: number): Promise<boolean> {
    try {
      const linhas = await consultar<{ id: number }>("DELETE FROM autores WHERE id = $1 RETURNING id", [id]);
      return linhas.length > 0;
    } catch (erro) {
      return traduzirErroBanco(erro);
    }
  }

  async possuiLivros(id: number): Promise<boolean> {
    const [linha] = await consultar<{ existe: boolean }>(
      "SELECT EXISTS (SELECT 1 FROM livros WHERE autor_id = $1) AS existe",
      [id],
    );
    return linha.existe;
  }
}