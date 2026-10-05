import { pool, testarConexao } from "./database/connection";
import { MenuPrincipal } from "./menus/MenuPrincipal";
import { Terminal } from "./utils/Terminal";
import { mensagemDeErro } from "./utils/erros";
import { banner } from "./utils/formatacao";

async function main(): Promise<void> {
  const terminal = new Terminal();
  try {
    console.log(banner());
    await testarConexao();
    await new MenuPrincipal(terminal).exibir();
    console.log("\nAté logo!");
  } catch (erro) {
    console.log(`\nErro: ${mensagemDeErro(erro)}`);
    process.exitCode = 1;
  } finally {
    terminal.fechar();
    await pool.end();
  }
}

main();
