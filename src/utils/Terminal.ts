import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

export type Validador = (valor: string) => string | null;

export function opcional(validar: Validador): Validador {
  return (valor) => (valor === "" ? null : validar(valor));
}

export class Terminal {
  private readonly leitor = readline.createInterface({ input, output });

  async perguntar(pergunta: string): Promise<string> {
    const resposta = await this.leitor.question(pergunta);
    return resposta.trim();
  }

  async perguntarAteValido(pergunta: string, validar: Validador): Promise<string> {
    while (true) {
      const resposta = await this.perguntar(pergunta);
      const erro = validar(resposta);
      if (!erro) {
        return resposta;
      }
      console.log(`  ${erro}`);
    }
  }

  async perguntarInteiroPositivo(pergunta: string): Promise<number> {
    const resposta = await this.perguntarAteValido(pergunta, (valor) =>
      /^\d+$/.test(valor) && Number(valor) > 0 ? null : "Digite um número inteiro maior que zero.",
    );
    return Number(resposta);
  }

  async confirmar(pergunta: string): Promise<boolean> {
    const resposta = await this.perguntar(`${pergunta} (s/n): `);
    return resposta.toLowerCase() === "s";
  }

  async pausar(): Promise<void> {
    await this.perguntar("\nPressione ENTER para continuar...");
  }

  fechar(): void {
    this.leitor.close();
  }
}
