import { Autor } from "../models/Autor";
import { AutorService } from "../services/AutorService";
import { Terminal, Validador } from "../utils/Terminal";
import { formatarData } from "../utils/formatacao";
import { validarDataNascimento, validarTextoObrigatorio } from "../utils/validacao";

function opcional(validar: Validador): Validador {
  return (valor) => (valor === "" ? null : validar(valor));
}

function paraTabela(autor: Autor) {
  return {
    Código: autor.id,
    Nome: autor.nome,
    Nacionalidade: autor.nacionalidade,
    Nascimento: formatarData(autor.dataNascimento),
  };
}

export class AutorController {
  constructor(
    private readonly terminal: Terminal,
    private readonly servico = new AutorService(),
  ) {}

  async listar(): Promise<void> {
    const autores = await this.servico.listar();
    if (autores.length === 0) {
      console.log("\nNenhum autor cadastrado.");
      return;
    }
    console.table(autores.map(paraTabela));
  }

  async buscar(): Promise<void> {
    const id = await this.terminal.perguntarInteiroPositivo("Código do autor: ");
    const autor = await this.servico.buscarPorId(id);
    console.table([paraTabela(autor)]);
  }

  async cadastrar(): Promise<void> {
    const nome = await this.terminal.perguntarAteValido("Nome: ", (valor) =>
      validarTextoObrigatorio(valor, "Nome"),
    );
    const nacionalidade = await this.terminal.perguntarAteValido("Nacionalidade: ", (valor) =>
      validarTextoObrigatorio(valor, "Nacionalidade"),
    );
    const dataNascimento = await this.terminal.perguntarAteValido(
      "Data de nascimento (AAAA-MM-DD, ENTER para deixar em branco): ",
      opcional(validarDataNascimento),
    );

    const autor = await this.servico.cadastrar({
      nome,
      nacionalidade,
      dataNascimento: dataNascimento || null,
    });
    console.log(`\nAutor cadastrado com o código ${autor.id}: ${autor.rotulo()}`);
  }

  async atualizar(): Promise<void> {
    const id = await this.terminal.perguntarInteiroPositivo("Código do autor: ");
    const atual = await this.servico.buscarPorId(id);
    console.log("Pressione ENTER para manter o valor atual.");

    const nome = await this.terminal.perguntarAteValido(
      `Nome [${atual.nome}]: `,
      opcional((valor) => validarTextoObrigatorio(valor, "Nome")),
    );
    const nacionalidade = await this.terminal.perguntarAteValido(
      `Nacionalidade [${atual.nacionalidade}]: `,
      opcional((valor) => validarTextoObrigatorio(valor, "Nacionalidade")),
    );
    const dataNascimento = await this.terminal.perguntarAteValido(
      `Data de nascimento [${formatarData(atual.dataNascimento)}]: `,
      opcional(validarDataNascimento),
    );

    const autor = await this.servico.atualizar(id, {
      nome: nome || atual.nome,
      nacionalidade: nacionalidade || atual.nacionalidade,
      dataNascimento: dataNascimento || atual.dataNascimento,
    });
    console.log(`\nAutor atualizado: ${autor.rotulo()}`);
  }

  async remover(): Promise<void> {
    const id = await this.terminal.perguntarInteiroPositivo("Código do autor: ");
    const autor = await this.servico.buscarPorId(id);
    const confirmado = await this.terminal.confirmar(`Remover ${autor.rotulo()}?`);
    if (!confirmado) {
      console.log("\nRemoção cancelada.");
      return;
    }
    await this.servico.remover(id);
    console.log("\nAutor removido.");
  }
}