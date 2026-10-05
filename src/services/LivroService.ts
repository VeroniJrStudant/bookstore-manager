import { DadosLivro, Livro } from "../models/Livro";
import { LivroRepository } from "../repositories/LivroRepository";
import { AutorService } from "./AutorService";
import { ErroDeNegocio } from "../utils/erros";
import {
  somenteDigitos,
  validarAnoPublicacao,
  validarId,
  validarIsbn,
  validarQuantidade,
  validarTextoObrigatorio,
} from "../utils/validacao";

export class LivroService {
  constructor(
    private readonly repositorio = new LivroRepository(),
    private readonly autores = new AutorService(),
  ) {}

  listar(): Promise<Livro[]> {
    return this.repositorio.listar();
  }

  async buscarPorId(id: number): Promise<Livro> {
    const livro = await this.repositorio.buscarPorId(id);
    if (!livro) {
      throw new ErroDeNegocio("Livro não encontrado.");
    }
    return livro;
  }

  async cadastrar(dados: DadosLivro): Promise<Livro> {
    const livro = this.validar(dados);
    await this.autores.buscarPorId(livro.autorId);
    const id = await this.repositorio.criar(livro);
    return this.buscarPorId(id);
  }

  async atualizar(id: number, dados: DadosLivro): Promise<Livro> {
    const atual = await this.buscarPorId(id);
    const livro = this.validar(dados);
    await this.autores.buscarPorId(livro.autorId);

    const emprestados = atual.quantidadeTotal - atual.quantidadeDisponivel;
    if (livro.quantidadeTotal < emprestados) {
      throw new ErroDeNegocio(
        `A quantidade total não pode ser menor que ${emprestados}, o número de exemplares emprestados.`,
      );
    }

    await this.repositorio.atualizar(id, livro);
    return this.buscarPorId(id);
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id);
    if (await this.repositorio.possuiEmprestimos(id)) {
      throw new ErroDeNegocio("Não é possível remover: o livro possui empréstimos registrados.");
    }
    await this.repositorio.remover(id);
  }

  private validar(dados: DadosLivro): DadosLivro {
    const erro =
      validarTextoObrigatorio(dados.titulo, "Título") ??
      validarIsbn(dados.isbn) ??
      validarAnoPublicacao(dados.anoPublicacao) ??
      validarQuantidade(dados.quantidadeTotal) ??
      validarId(dados.autorId);
    if (erro) {
      throw new ErroDeNegocio(erro);
    }
    return { ...dados, titulo: dados.titulo.trim(), isbn: somenteDigitos(dados.isbn) };
  }
}