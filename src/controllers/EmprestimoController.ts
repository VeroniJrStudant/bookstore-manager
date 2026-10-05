import { Emprestimo } from "../models/Emprestimo";
import { ClienteService } from "../services/ClienteService";
import { EmprestimoService } from "../services/EmprestimoService";
import { LivroService } from "../services/LivroService";
import { Terminal } from "../utils/Terminal";
import { formatarData } from "../utils/formatacao";
import { validarDataDevolucaoPrevista } from "../utils/validacao";

function paraTabela(emprestimo: Emprestimo) {
  return {
    Código: emprestimo.id,
    Livro: emprestimo.tituloLivro,
    Cliente: emprestimo.nomeCliente,
    Empréstimo: formatarData(emprestimo.dataEmprestimo),
    "Devolução prevista": formatarData(emprestimo.dataPrevistaDevolucao),
    Devolvido: formatarData(emprestimo.dataDevolucao),
    Situação: emprestimo.situacao,
  };
}

export class EmprestimoController {
  constructor(
    private readonly terminal: Terminal,
    private readonly servico = new EmprestimoService(),
    private readonly livros = new LivroService(),
    private readonly clientes = new ClienteService(),
  ) {}

  async listar(): Promise<void> {
    this.mostrarTabela(await this.servico.listar(), "Nenhum empréstimo registrado.");
  }

  async listarAtivos(): Promise<void> {
    this.mostrarTabela(await this.servico.listarAtivos(), "Nenhum empréstimo ativo.");
  }

  async registrarEmprestimo(): Promise<void> {
    await this.mostrarLivrosDisponiveis();
    const livroId = await this.terminal.perguntarInteiroPositivo("Código do livro: ");
    await this.mostrarClientes();
    const clienteId = await this.terminal.perguntarInteiroPositivo("Código do cliente: ");
    const dataPrevistaDevolucao = await this.terminal.perguntarAteValido(
      "Data prevista de devolução (AAAA-MM-DD): ",
      validarDataDevolucaoPrevista,
    );

    const emprestimo = await this.servico.registrarEmprestimo({ livroId, clienteId, dataPrevistaDevolucao });
    console.log(`\nEmpréstimo registrado: ${emprestimo.rotulo()}`);
  }

  async registrarDevolucao(): Promise<void> {
    const ativos = await this.servico.listarAtivos();
    if (ativos.length === 0) {
      console.log("\nNenhum empréstimo ativo para devolver.");
      return;
    }
    console.table(ativos.map(paraTabela));

    const id = await this.terminal.perguntarInteiroPositivo("Código do empréstimo: ");
    const emprestimo = await this.servico.registrarDevolucao(id);
    console.log(`\nDevolução registrada: ${emprestimo.rotulo()}`);
  }

  private mostrarTabela(emprestimos: Emprestimo[], mensagemVazia: string): void {
    if (emprestimos.length === 0) {
      console.log(`\n${mensagemVazia}`);
      return;
    }
    console.table(emprestimos.map(paraTabela));
  }

  private async mostrarLivrosDisponiveis(): Promise<void> {
    const livros = await this.livros.listar();
    console.log("Livros com exemplares disponíveis:");
    for (const livro of livros.filter((item) => item.estaDisponivel())) {
      console.log(`  ${livro.id} - ${livro.titulo} (${livro.quantidadeDisponivel} disponível(is))`);
    }
  }

  private async mostrarClientes(): Promise<void> {
    const clientes = await this.clientes.listar();
    console.log("Clientes cadastrados:");
    for (const cliente of clientes) {
      console.log(`  ${cliente.id} - ${cliente.nome}`);
    }
  }
}
