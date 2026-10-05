import { Cliente } from "../models/Cliente";
import { ClienteService } from "../services/ClienteService";
import { Terminal, opcional } from "../utils/Terminal";
import { formatarTelefone } from "../utils/formatacao";
import { validarCpf, validarEmail, validarTelefone, validarTextoObrigatorio } from "../utils/validacao";

function paraTabela(cliente: Cliente) {
  return {
    Código: cliente.id,
    Nome: cliente.nome,
    "E-mail": cliente.email,
    Telefone: formatarTelefone(cliente.telefone),
    CPF: cliente.cpfFormatado(),
  };
}

export class ClienteController {
  constructor(
    private readonly terminal: Terminal,
    private readonly servico = new ClienteService(),
  ) {}

  async listar(): Promise<void> {
    const clientes = await this.servico.listar();
    if (clientes.length === 0) {
      console.log("\nNenhum cliente cadastrado.");
      return;
    }
    console.table(clientes.map(paraTabela));
  }

  async buscar(): Promise<void> {
    const id = await this.terminal.perguntarInteiroPositivo("Código do cliente: ");
    const cliente = await this.servico.buscarPorId(id);
    console.table([paraTabela(cliente)]);
  }

  async cadastrar(): Promise<void> {
    const nome = await this.terminal.perguntarAteValido("Nome: ", (valor) =>
      validarTextoObrigatorio(valor, "Nome"),
    );
    const email = await this.terminal.perguntarAteValido("E-mail: ", validarEmail);
    const telefone = await this.terminal.perguntarAteValido("Telefone com DDD: ", validarTelefone);
    const cpf = await this.terminal.perguntarAteValido("CPF: ", validarCpf);

    const cliente = await this.servico.cadastrar({ nome, email, telefone, cpf });
    console.log(`\nCliente cadastrado com o código ${cliente.id}: ${cliente.rotulo()}`);
  }

  async atualizar(): Promise<void> {
    const id = await this.terminal.perguntarInteiroPositivo("Código do cliente: ");
    const atual = await this.servico.buscarPorId(id);
    console.log("Pressione ENTER para manter o valor atual.");

    const nome = await this.terminal.perguntarAteValido(
      `Nome [${atual.nome}]: `,
      opcional((valor) => validarTextoObrigatorio(valor, "Nome")),
    );
    const email = await this.terminal.perguntarAteValido(`E-mail [${atual.email}]: `, opcional(validarEmail));
    const telefone = await this.terminal.perguntarAteValido(
      `Telefone [${formatarTelefone(atual.telefone)}]: `,
      opcional(validarTelefone),
    );
    const cpf = await this.terminal.perguntarAteValido(`CPF [${atual.cpfFormatado()}]: `, opcional(validarCpf));

    const cliente = await this.servico.atualizar(id, {
      nome: nome || atual.nome,
      email: email || atual.email,
      telefone: telefone || atual.telefone,
      cpf: cpf || atual.cpf,
    });
    console.log(`\nCliente atualizado: ${cliente.rotulo()}`);
  }

  async remover(): Promise<void> {
    const id = await this.terminal.perguntarInteiroPositivo("Código do cliente: ");
    const cliente = await this.servico.buscarPorId(id);
    const confirmado = await this.terminal.confirmar(`Remover ${cliente.rotulo()}?`);
    if (!confirmado) {
      console.log("\nRemoção cancelada.");
      return;
    }
    await this.servico.remover(id);
    console.log("\nCliente removido.");
  }
}