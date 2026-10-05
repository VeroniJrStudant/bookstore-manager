import { pool } from "../database/connection";
import { MenuClientes } from "../menus/MenuClientes";
import { Terminal } from "../utils/Terminal";

async function testar(): Promise<void> {
  const terminal = new Terminal();
  try {
    await new MenuClientes(terminal).exibir();
  } finally {
    terminal.fechar();
    await pool.end();
  }
}

testar();