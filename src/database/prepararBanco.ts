import { readFile } from "node:fs/promises";
import path from "node:path";
import dotenv from "dotenv";
import { Client } from "pg";

dotenv.config();

const nomeBanco = process.env.DB_NAME ?? "livraria_cli";
const carregarExemplos = process.argv.includes("--seed");

function configuracao(database: string) {
  return {
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USER ?? "postgres",
    password: process.env.DB_PASSWORD ?? "postgres",
    database,
  };
}

async function criarBancoSeNecessario(): Promise<void> {
  if (!/^[A-Za-z0-9_]+$/.test(nomeBanco)) {
    throw new Error(`Nome de banco inválido: ${nomeBanco}`);
  }

  const admin = new Client(configuracao(process.env.DB_ADMIN_DB ?? "postgres"));
  await admin.connect();
  try {
    const existe = await admin.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [nomeBanco],
    );
    if (existe.rowCount === 0) {
      await admin.query(`CREATE DATABASE ${nomeBanco}`);
      console.log(`Banco ${nomeBanco} criado.`);
    } else {
      console.log(`Banco ${nomeBanco} já existe.`);
    }
  } finally {
    await admin.end();
  }
}

async function executarArquivo(cliente: Client, arquivo: string): Promise<void> {
  const caminho = path.resolve(__dirname, "..", "..", "database", arquivo);
  const sql = await readFile(caminho, "utf-8");
  await cliente.query(sql);
  console.log(`${arquivo} executado.`);
}

async function prepararBanco(): Promise<void> {
  await criarBancoSeNecessario();

  const cliente = new Client(configuracao(nomeBanco));
  await cliente.connect();
  try {
    await executarArquivo(cliente, "schema.sql");
    if (carregarExemplos) {
      await executarArquivo(cliente, "seed.sql");
    }
  } finally {
    await cliente.end();
  }
}

prepararBanco().catch((erro: unknown) => {
  console.error("Falha ao preparar o banco:", erro instanceof Error ? erro.message : erro);
  process.exitCode = 1;
});