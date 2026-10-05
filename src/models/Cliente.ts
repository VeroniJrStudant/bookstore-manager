export interface DadosCliente {
    nome: string;
    email: string;
    telefone: string;
    cpf: string;
  }
  
  export interface ICliente extends DadosCliente {
    id: number;
  }
  
  export class Cliente implements ICliente {
    constructor(
      public readonly id: number,
      public nome: string,
      public email: string,
      public telefone: string,
      public cpf: string,
    ) {}
  
    cpfFormatado(): string {
      return this.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
  
    rotulo(): string {
      return `${this.nome} - CPF ${this.cpfFormatado()}`;
    }
  }