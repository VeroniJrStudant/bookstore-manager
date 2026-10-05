import { pool } from "../database/connection";
import { MenuLivros } from "../menus/MenuLivros";
import { Terminal } from "../utils/Terminal";

async function testar(): Promise<void> {
  const terminal = new Terminal();
  try {
    await new MenuLivros(terminal).exibir();
  } finally {
    terminal.fechar();
    await pool.end();
  }
}

testar();