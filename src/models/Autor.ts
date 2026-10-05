export interface DadosAutor {
    nome: string;
    nacionalidade: string;
    dataNascimento: string | null;
}

export interface IAutor extends DadosAutor {
    id: number;
}

export class Autor implements IAutor {
    constructor(
        public readonly id: number,
        public nome: string,
        public nacionalidade: string,
        public dataNascimento: string | null,
    ) {}

    rotulo(): string {
        return `${this.nome} (${this.nacionalidade})`;
    }   
}