import { Terminal } from "../utils/Terminal";
import { MenuAutores } from "./MenuAutores";
import { MenuClientes } from "./MenuClientes";
import { MenuEmprestimos } from "./MenuEmprestimos";
import { MenuLivros } from "./MenuLivros";
import { MenuRelatorios } from "./MenuRelatorios";

export class MenuPrincipal {
  constructor(private readonly terminal: Terminal) {}

  async exibir(): Promise<void> {
    while (true) {
      console.log("\n===== Menu principal =====");
      console.log("1 - Autores");
      console.log("2 - Livros");
      console.log("3 - Clientes");
      console.log("4 - Empréstimos");
      console.log("5 - Relatórios");
      console.log("0 - Sair");

      const opcao = await this.terminal.perguntar("Escolha uma opção: ");
      switch (opcao) {
        case "1":
          await new MenuAutores(this.terminal).exibir();
          break;
        case "2":
          await new MenuLivros(this.terminal).exibir();
          break;
        case "3":
          await new MenuClientes(this.terminal).exibir();
          break;
        case "4":
          await new MenuEmprestimos(this.terminal).exibir();
          break;
        case "5":
          await new MenuRelatorios(this.terminal).exibir();
          break;
        case "0":
          return;
        default:
          console.log("Opção inválida.");
      }
    }
  }
}