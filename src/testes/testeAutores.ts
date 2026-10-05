import { pool } from "../database/connection";
import { MenuAutores } from "../menus/MenuAutores";
import { Terminal } from "../utils/Terminal";

async function testar(): Promise<void> {
  const terminal = new Terminal();
  try {
    await new MenuAutores(terminal).exibir();
  } finally {
    terminal.fechar();
    await pool.end();
  }
}

testar();