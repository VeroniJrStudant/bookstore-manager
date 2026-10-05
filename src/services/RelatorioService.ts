import {
    ClienteComEmprestimoAtivo,
    EmprestimosPorLivro,
    LivroDisponivel,
    LivroEmprestado,
    LivrosPorAutor,
  } from "../models/Relatorios";
  import { RelatorioRepository } from "../repositories/RelatorioRepository";
  
  export class RelatorioService {
    constructor(private readonly repositorio = new RelatorioRepository()) {}
  
    livrosDisponiveis(): Promise<LivroDisponivel[]> {
      return this.repositorio.livrosDisponiveis();
    }
  
    livrosEmprestados(): Promise<LivroEmprestado[]> {
      return this.repositorio.livrosEmprestados();
    }
  
    livrosPorAutor(): Promise<LivrosPorAutor[]> {
      return this.repositorio.livrosPorAutor();
    }
  
    emprestimosPorLivro(): Promise<EmprestimosPorLivro[]> {
      return this.repositorio.emprestimosPorLivro();
    }
  
    clientesComEmprestimoAtivo(): Promise<ClienteComEmprestimoAtivo[]> {
      return this.repositorio.clientesComEmprestimoAtivo();
    }
  }