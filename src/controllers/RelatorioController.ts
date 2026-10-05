import { RelatorioService } from "../services/RelatorioService";
import { formatarData } from "../utils/formatacao";

type LinhaTabela = Record<string, string | number>;

function mostrar<T>(titulo: string, linhas: T[], paraTabela: (linha: T) => LinhaTabela): void {
  console.log(`\n${titulo}`);
  if (linhas.length === 0) {
    console.log("Nenhum registro encontrado.");
    return;
  }
  console.table(linhas.map(paraTabela));
}

export class RelatorioController {
  constructor(private readonly servico = new RelatorioService()) {}

  async livrosDisponiveis(): Promise<void> {
    mostrar("Livros disponíveis", await this.servico.livrosDisponiveis(), (livro) => ({
      Título: livro.titulo,
      Autor: livro.autor,
      Disponíveis: livro.disponiveis,
    }));
  }

  async livrosEmprestados(): Promise<void> {
    mostrar("Livros emprestados", await this.servico.livrosEmprestados(), (livro) => ({
      Título: livro.titulo,
      Cliente: livro.cliente,
      Empréstimo: formatarData(livro.dataEmprestimo),
      "Devolução prevista": formatarData(livro.dataPrevistaDevolucao),
    }));
  }

  async livrosPorAutor(): Promise<void> {
    mostrar("Livros cadastrados por autor", await this.servico.livrosPorAutor(), (linha) => ({
      Autor: linha.autor,
      Livros: linha.totalLivros,
      Exemplares: linha.totalExemplares,
    }));
  }

  async emprestimosPorLivro(): Promise<void> {
    mostrar("Empréstimos por livro (5 mais emprestados)", await this.servico.emprestimosPorLivro(), (linha) => ({
      Título: linha.titulo,
      Empréstimos: linha.totalEmprestimos,
    }));
  }

  async clientesComEmprestimoAtivo(): Promise<void> {
    mostrar(
      "Clientes com empréstimos ativos",
      await this.servico.clientesComEmprestimoAtivo(),
      (linha) => ({
        Cliente: linha.cliente,
        "E-mail": linha.email,
        "Empréstimos ativos": linha.emprestimosAtivos,
      }),
    );
  }
}