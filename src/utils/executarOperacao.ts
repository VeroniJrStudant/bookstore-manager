import { Terminal } from "./Terminal";
import { mensagemDeErro } from "./erros";

export async function executarOperacao(
  terminal: Terminal,
  operacao: () => Promise<void>,
): Promise<void> {
  try {
    await operacao();
  } catch (erro) {
    console.log(`\nErro: ${mensagemDeErro(erro)}`);
  }
  await terminal.pausar();
}
