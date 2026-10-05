export function banner(): string {
    const linha = "=".repeat(40);
    return `${linha}\n         BookStore Manager CLI\n${linha}`;
  }
  
  export function formatarData(data: string | null): string {
    if (!data) {
      return "-";
    }
    const [ano, mes, dia] = data.slice(0, 10).split("-");
    return `${dia}/${mes}/${ano}`;
  }
  
  export function formatarTelefone(telefone: string): string {
    return telefone.length === 11
      ? telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
      : telefone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }