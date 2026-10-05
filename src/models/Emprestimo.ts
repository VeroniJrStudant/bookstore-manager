export type SituacaoEmprestimo = "ativo" | "devolvido";

export interface DadosEmprestimo {
  livroId: number;
  clienteId: number;
  dataPrevistaDevolucao: string;
}

export interface IEmprestimo extends DadosEmprestimo {
  id: number;
  tituloLivro: string;
  nomeCliente: string;
  dataEmprestimo: string;
  dataDevolucao: string | null;
}

export class Emprestimo implements IEmprestimo {
  constructor(
    public readonly id: number,
    public livroId: number,
    public clienteId: number,
    public tituloLivro: string,
    public nomeCliente: string,
    public dataEmprestimo: string,
    public dataPrevistaDevolucao: string,
    public dataDevolucao: string | null,
  ) {}

  estaDevolvido(): boolean {
    return this.dataDevolucao !== null;
  }

  get situacao(): SituacaoEmprestimo {
    return this.estaDevolvido() ? "devolvido" : "ativo";
  }

  rotulo(): string {
    return `#${this.id} ${this.tituloLivro} - ${this.nomeCliente} (${this.situacao})`;
  }
}