export interface LivroDisponivel {
  titulo: string;
  autor: string;
  disponiveis: number;
}

export interface LivroEmprestado {
  titulo: string;
  cliente: string;
  dataEmprestimo: string;
  dataPrevistaDevolucao: string;
}

export interface LivrosPorAutor {
  autor: string;
  totalLivros: number;
  totalExemplares: number;
}

export interface EmprestimosPorLivro {
  titulo: string;
  totalEmprestimos: number;
}

export interface ClienteComEmprestimoAtivo {
  cliente: string;
  email: string;
  emprestimosAtivos: number;
}
