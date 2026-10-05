import { executarTransacao } from "../database/connection";
import { DadosEmprestimo, Emprestimo } from "../models/Emprestimo";
import { EmprestimoRepository } from "../repositories/EmprestimoRepository";
import { ClienteService } from "./ClienteService";
import { LivroService } from "./LivroService";
import { ErroDeNegocio } from "../utils/erros";
import { validarDataDevolucaoPrevista, validarId } from "../utils/validacao";

export class EmprestimoService {
  constructor(
    private readonly repositorio = new EmprestimoRepository(),
    private readonly livros = new LivroService(),
    private readonly clientes = new ClienteService(),
  ) {}

  listar(): Promise<Emprestimo[]> {
    return this.repositorio.listar();
  }

  listarAtivos(): Promise<Emprestimo[]> {
    return this.repositorio.listarAtivos();
  }

  async buscarPorId(id: number): Promise<Emprestimo> {
    const emprestimo = await this.repositorio.buscarPorId(id);
    if (!emprestimo) {
      throw new ErroDeNegocio("Empréstimo não encontrado.");
    }
    return emprestimo;
  }

  async registrarEmprestimo(dados: DadosEmprestimo): Promise<Emprestimo> {
    const erro =
      validarId(dados.livroId) ??
      validarId(dados.clienteId) ??
      validarDataDevolucaoPrevista(dados.dataPrevistaDevolucao);
    if (erro) {
      throw new ErroDeNegocio(erro);
    }

    await this.livros.buscarPorId(dados.livroId);
    await this.clientes.buscarPorId(dados.clienteId);

    const id = await executarTransacao(async (conexao) => {
      await this.livros.retirarExemplar(dados.livroId, conexao);
      return this.repositorio.criar(dados, conexao);
    });
    return this.buscarPorId(id);
  }

  async registrarDevolucao(id: number): Promise<Emprestimo> {
    const emprestimo = await this.buscarPorId(id);
    if (emprestimo.estaDevolvido()) {
      throw new ErroDeNegocio("Este empréstimo já foi devolvido.");
    }

    await executarTransacao(async (conexao) => {
      const livroId = await this.repositorio.registrarDevolucao(id, conexao);
      if (livroId === null) {
        throw new ErroDeNegocio("Este empréstimo já foi devolvido.");
      }
      await this.livros.devolverExemplar(livroId, conexao);
    });
    return this.buscarPorId(id);
  }
}