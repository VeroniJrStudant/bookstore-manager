import { RelatorioController } from "../controllers/RelatorioController";
import { Terminal } from "../utils/Terminal";
import { executarOperacao } from "../utils/executarOperacao";

export class MenuRelatorios {
  private readonly controller = new RelatorioController();

  constructor(private readonly terminal: Terminal) {}

  async exibir(): Promise<void> {
    while (true) {
      console.log("\n--- Relatórios ---");
      console.log("1 - Livros disponíveis");
      console.log("2 - Livros emprestados");
      console.log("3 - Livros cadastrados por autor");
      console.log("4 - Empréstimos por livro");
      console.log("5 - Clientes com empréstimos ativos");
      console.log("0 - Voltar");

      const opcao = await this.terminal.perguntar("Escolha uma opção: ");
      switch (opcao) {
        case "1":
          await executarOperacao(this.terminal, () => this.controller.livrosDisponiveis());
          break;
        case "2":
          await executarOperacao(this.terminal, () => this.controller.livrosEmprestados());
          break;
        case "3":
          await executarOperacao(this.terminal, () => this.controller.livrosPorAutor());
          break;
        case "4":
          await executarOperacao(this.terminal, () => this.controller.emprestimosPorLivro());
          break;
        case "5":
          await executarOperacao(this.terminal, () => this.controller.clientesComEmprestimoAtivo());
          break;
        case "0":
          return;
        default:
          console.log("Opção inválida.");
      }
    }
  }
}