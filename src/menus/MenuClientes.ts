import { ClienteController } from "../controllers/ClienteController";
import { Terminal } from "../utils/Terminal";
import { executarOperacao } from "../utils/executarOperacao";

export class MenuClientes {
  private readonly controller: ClienteController;

  constructor(private readonly terminal: Terminal) {
    this.controller = new ClienteController(terminal);
  }

  async exibir(): Promise<void> {
    while (true) {
      console.log("\n--- Clientes ---");
      console.log("1 - Listar clientes");
      console.log("2 - Buscar cliente por código");
      console.log("3 - Cadastrar cliente");
      console.log("4 - Atualizar cliente");
      console.log("5 - Remover cliente");
      console.log("0 - Voltar");

      const opcao = await this.terminal.perguntar("Escolha uma opção: ");
      switch (opcao) {
        case "1":
          await executarOperacao(this.terminal, () => this.controller.listar());
          break;
        case "2":
          await executarOperacao(this.terminal, () => this.controller.buscar());
          break;
        case "3":
          await executarOperacao(this.terminal, () => this.controller.cadastrar());
          break;
        case "4":
          await executarOperacao(this.terminal, () => this.controller.atualizar());
          break;
        case "5":
          await executarOperacao(this.terminal, () => this.controller.remover());
          break;
        case "0":
          return;
        default:
          console.log("Opção inválida.");
      }
    }
  }
}