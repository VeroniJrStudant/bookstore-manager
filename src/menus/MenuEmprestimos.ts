import { EmprestimoController } from "../controllers/EmprestimoController";
import { Terminal } from "../utils/Terminal";
import { executarOperacao } from "../utils/executarOperacao";

export class MenuEmprestimos {
  private readonly controller: EmprestimoController;

  constructor(private readonly terminal: Terminal) {
    this.controller = new EmprestimoController(terminal);
  }

  async exibir(): Promise<void> {
    while (true) {
      console.log("\n--- Empréstimos ---");
      console.log("1 - Listar todos os empréstimos");
      console.log("2 - Listar empréstimos ativos");
      console.log("3 - Registrar empréstimo");
      console.log("4 - Registrar devolução");
      console.log("0 - Voltar");

      const opcao = await this.terminal.perguntar("Escolha uma opção: ");
      switch (opcao) {
        case "1":
          await executarOperacao(this.terminal, () => this.controller.listar());
          break;
        case "2":
          await executarOperacao(this.terminal, () => this.controller.listarAtivos());
          break;
        case "3":
          await executarOperacao(this.terminal, () => this.controller.registrarEmprestimo());
          break;
        case "4":
          await executarOperacao(this.terminal, () => this.controller.registrarDevolucao());
          break;
        case "0":
          return;
        default:
          console.log("Opção inválida.");
      }
    }
  }
}