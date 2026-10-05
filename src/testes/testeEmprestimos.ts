import { pool } from "../database/connection";
import { MenuEmprestimos } from "../menus/MenuEmprestimos";
import { Terminal } from "../utils/Terminal";

async function testar(): Promise<void> {
  const terminal = new Terminal();
  try {
    await new MenuEmprestimos(terminal).exibir();
  } finally {
    terminal.fechar();
    await pool.end();
  }
}

testar();