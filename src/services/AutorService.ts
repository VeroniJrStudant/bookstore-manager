import { Autor, DadosAutor } from "../models/Autor";
import { AutorRepository } from "../repositories/AutorRepository";
import { ErroDeNegocio } from "../utils/erros";
import { validarDataNascimento, validarTextoObrigatorio } from "../utils/validacao";

export class AutorService {
  constructor(private readonly repositorio = new AutorRepository()) {}

  listar(): Promise<Autor[]> {
    return this.repositorio.listar();
  }

  async buscarPorId(id: number): Promise<Autor> {
    const autor = await this.repositorio.buscarPorId(id);
    if (!autor) {
      throw new ErroDeNegocio("Autor não encontrado.");
    }
    return autor;
  }

  async cadastrar(dados: DadosAutor): Promise<Autor> {
    this.validar(dados);
    return this.repositorio.criar(dados);
  }

  async atualizar(id: number, dados: DadosAutor): Promise<Autor> {
    this.validar(dados);
    const autor = await this.repositorio.atualizar(id, dados);
    if (!autor) {
      throw new ErroDeNegocio("Autor não encontrado.");
    }
    return autor;
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id);
    if (await this.repositorio.possuiLivros(id)) {
      throw new ErroDeNegocio("Não é possível remover: o autor possui livros cadastrados.");
    }
    await this.repositorio.remover(id);
  }

  private validar(dados: DadosAutor): void {
    const erro =
      validarTextoObrigatorio(dados.nome, "Nome") ??
      validarTextoObrigatorio(dados.nacionalidade, "Nacionalidade") ??
      (dados.dataNascimento ? validarDataNascimento(dados.dataNascimento) : null);
    if (erro) {
      throw new ErroDeNegocio(erro);
    }
  }
}