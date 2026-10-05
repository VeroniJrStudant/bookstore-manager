import { AutorController } from "../controllers/AutorController";
import { Terminal } from "../utils/Terminal";
import { executarOperacao } from "../utils/executarOperacao";

export class MenuAutores {
  private readonly controller: AutorController;

  constructor(private readonly terminal: Terminal) {
    this.controller = new AutorController(terminal);
  }

  async exibir(): Promise<void> {
    while (true) {
      console.log("\n--- Autores ---");
      console.log("1 - Listar autores");
      console.log("2 - Buscar autor por código");
      console.log("3 - Cadastrar autor");
      console.log("4 - Atualizar autor");
      console.log("5 - Remover autor");
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