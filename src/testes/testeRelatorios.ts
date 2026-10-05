import { pool } from "../database/connection";
import { MenuRelatorios } from "../menus/MenuRelatorios";
import { Terminal } from "../utils/Terminal";

async function testar(): Promise<void> {
  const terminal = new Terminal();
  try {
    await new MenuRelatorios(terminal).exibir();
  } finally {
    terminal.fechar();
    await pool.end();
  }
}

testar();