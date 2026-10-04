import dotenv from "dotenv";
import { Pool, PoolClient, QueryResultRow } from "pg";

dotenv.config();

export const pool = new Pool({
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USER ?? "postgres",
    password: process.env.DB_PASSWORD ?? "postgres",
    database: process.env.DB_NAME ?? "livraria_cli",
});

export async function consultar<T extends QueryResultRow>(
    sql: string,
    parametros: unknown[] = [],
    cliente?: PoolClient,
): Promise<T[]>{
    const resultado = cliente
        ? await cliente.query<T>(sql, parametros)
        : await pool.query<T>(sql, parametros);
    return resultado.rows;
}

export async function testarConexao(): Promise<void>{
    await pool.query("SELECT 1");
}

export async function executarTransacao<T>(
    acao: (cliente: PoolClient) => Promise<T>,
): Promise<T>{
    const cliente = await pool.connect();
    try {
        await cliente.query("BEGIN");
        const resultado = await acao(cliente);
        await cliente.query("COMMIT");
        return resultado;
    } catch (erro) {
        await cliente.query("ROLLBACK");
        throw erro;
    } finally {
        cliente.release();
    }
}