import { Cliente, DadosCliente } from "../models/Cliente";
import { ClienteRepository } from "../repositories/ClienteRepository";
import { ErroDeNegocio } from "../utils/erros";
import {
  somenteDigitos,
  validarCpf,
  validarEmail,
  validarTelefone,
  validarTextoObrigatorio,
} from "../utils/validacao";

export class ClienteService {
  constructor(private readonly repositorio = new ClienteRepository()) {}

  listar(): Promise<Cliente[]> {
    return this.repositorio.listar();
  }

  async buscarPorId(id: number): Promise<Cliente> {
    const cliente = await this.repositorio.buscarPorId(id);
    if (!cliente) {
      throw new ErroDeNegocio("Cliente não encontrado.");
    }
    return cliente;
  }

  async cadastrar(dados: DadosCliente): Promise<Cliente> {
    return this.repositorio.criar(this.validar(dados));
  }

  async atualizar(id: number, dados: DadosCliente): Promise<Cliente> {
    const cliente = await this.repositorio.atualizar(id, this.validar(dados));
    if (!cliente) {
      throw new ErroDeNegocio("Cliente não encontrado.");
    }
    return cliente;
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id);
    if (await this.repositorio.possuiEmprestimos(id)) {
      throw new ErroDeNegocio("Não é possível remover: o cliente possui empréstimos registrados.");
    }
    await this.repositorio.remover(id);
  }

  private validar(dados: DadosCliente): DadosCliente {
    const erro =
      validarTextoObrigatorio(dados.nome, "Nome") ??
      validarEmail(dados.email) ??
      validarTelefone(dados.telefone) ??
      validarCpf(dados.cpf);
    if (erro) {
      throw new ErroDeNegocio(erro);
    }
    return {
      nome: dados.nome.trim(),
      email: dados.email.trim().toLowerCase(),
      telefone: somenteDigitos(dados.telefone),
      cpf: somenteDigitos(dados.cpf),
    };
  }
}