import { validarCpf, validarEmail, validarData, validarIsbn } from "../utils/validacao";
import { banner, formatarData, formatarTelefone } from "../utils/formatacao";
import { ErroDeNegocio, mensagemDeErro } from "../utils/erros";   

console.log(banner());
console.log("CPF válido:", validarCpf("529.982.247-25"));
console.log("CPF repetido:", validarCpf("11111111111"));
console.log("E-mail sem domínio:", validarEmail("ana@"));
console.log("Data 31/02:", validarData("2026-02-31"));
console.log("ISBN curto:", validarIsbn("123"));
console.log(formatarData("2026-10-12"), formatarTelefone("48991234567"));
console.log(mensagemDeErro(new ErroDeNegocio("Autor não encontrado.")));
