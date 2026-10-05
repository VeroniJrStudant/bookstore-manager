import { Livro } from "../models/Livro";
import { AutorService } from "../services/AutorService";
import { LivroService } from "../services/LivroService";
import { Terminal, opcional } from "../utils/Terminal";
import {
  validarAnoPublicacao,
  validarId,
  validarIsbn,
  validarQuantidade,
  validarTextoObrigatorio,
} from "../utils/validacao";

function paraTabela(livro: Livro) {
  return {
    Código: livro.id,
    Título: livro.titulo,
    Autor: livro.nomeAutor,
    ISBN: livro.isbn,
    Ano: livro.anoPublicacao,
    Total: livro.quantidadeTotal,
    Disponíveis: livro.quantidadeDisponivel,
  };
}

export class LivroController {
  constructor(
    private readonly terminal: Terminal,
    private readonly servico = new LivroService(),
    private readonly autores = new AutorService(),
  ) {}

  async listar(): Promise<void> {
    const livros = await this.servico.listar();
    if (livros.length === 0) {
      console.log("\nNenhum livro cadastrado.");
      return;
    }
    console.table(livros.map(paraTabela));
  }

  async buscar(): Promise<void> {
    const id = await this.terminal.perguntarInteiroPositivo("Código do livro: ");
    const livro = await this.servico.buscarPorId(id);
    console.table([paraTabela(livro)]);
  }

  async cadastrar(): Promise<void> {
    const titulo = await this.terminal.perguntarAteValido("Título: ", (valor) =>
      validarTextoObrigatorio(valor, "Título"),
    );
    const isbn = await this.terminal.perguntarAteValido("ISBN: ", validarIsbn);
    const ano = await this.terminal.perguntarAteValido("Ano de publicação: ", (valor) =>
      validarAnoPublicacao(Number(valor)),
    );
    const quantidade = await this.terminal.perguntarInteiroPositivo("Quantidade de exemplares: ");
    await this.mostrarAutores();
    const autorId = await this.terminal.perguntarInteiroPositivo("Código do autor: ");

    const livro = await this.servico.cadastrar({
      titulo,
      isbn,
      anoPublicacao: Number(ano),
      quantidadeTotal: quantidade,
      autorId,
    });
    console.log(`\nLivro cadastrado com o código ${livro.id}: ${livro.rotulo()}`);
  }

  async atualizar(): Promise<void> {
    const id = await this.terminal.perguntarInteiroPositivo("Código do livro: ");
    const atual = await this.servico.buscarPorId(id);
    console.log("Pressione ENTER para manter o valor atual.");

    const titulo = await this.terminal.perguntarAteValido(
      `Título [${atual.titulo}]: `,
      opcional((valor) => validarTextoObrigatorio(valor, "Título")),
    );
    const isbn = await this.terminal.perguntarAteValido(`ISBN [${atual.isbn}]: `, opcional(validarIsbn));
    const ano = await this.terminal.perguntarAteValido(
      `Ano de publicação [${atual.anoPublicacao}]: `,
      opcional((valor) => validarAnoPublicacao(Number(valor))),
    );
    const quantidade = await this.terminal.perguntarAteValido(
      `Quantidade total [${atual.quantidadeTotal}]: `,
      opcional((valor) => validarQuantidade(Number(valor))),
    );
    await this.mostrarAutores();
    const autorId = await this.terminal.perguntarAteValido(
      `Código do autor [${atual.autorId}]: `,
      opcional((valor) => validarId(Number(valor))),
    );

    const livro = await this.servico.atualizar(id, {
      titulo: titulo || atual.titulo,
      isbn: isbn || atual.isbn,
      anoPublicacao: ano ? Number(ano) : atual.anoPublicacao,
      quantidadeTotal: quantidade ? Number(quantidade) : atual.quantidadeTotal,
      autorId: autorId ? Number(autorId) : atual.autorId,
    });
    console.log(`\nLivro atualizado: ${livro.rotulo()}`);
  }

  async remover(): Promise<void> {
    const id = await this.terminal.perguntarInteiroPositivo("Código do livro: ");
    const livro = await this.servico.buscarPorId(id);
    const confirmado = await this.terminal.confirmar(`Remover ${livro.rotulo()}?`);
    if (!confirmado) {
      console.log("\nRemoção cancelada.");
      return;
    }
    await this.servico.remover(id);
    console.log("\nLivro removido.");
  }

  private async mostrarAutores(): Promise<void> {
    const autores = await this.autores.listar();
    console.log("Autores cadastrados:");
    for (const autor of autores) {
      console.log(`  ${autor.id} - ${autor.nome}`);
    }
  }
}