export interface DadosLivro {
  titulo: string;
  isbn: string;
  anoPublicacao: number;
  quantidadeTotal: number;
  autorId: number;
}

export interface ILivro extends DadosLivro {
  id: number;
  quantidadeDisponivel: number;
  nomeAutor: string;
}

export class Livro implements ILivro {
  constructor(
    public readonly id: number,
    public titulo: string,
    public isbn: string,
    public anoPublicacao: number,
    public quantidadeTotal: number,
    public quantidadeDisponivel: number,
    public autorId: number,
    public nomeAutor: string,
  ) {}

  estaDisponivel(): boolean {
    return this.quantidadeDisponivel > 0;
  }

  rotulo(): string {
    return `${this.titulo} - ${this.nomeAutor}`;
  }
}