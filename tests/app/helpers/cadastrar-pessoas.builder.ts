import { PessoasRepository } from "../../../src/app/features/pessoas/repository/pessoas.repository";
import { cadastrarCidades } from "./cadastrar-cidades.builder";

export async function cadastrarPessoas() {
  const pessoasRepository = new PessoasRepository();
  const [cidade] = await cadastrarCidades();

  const pessoaData1 = {
    nome: "any_nome",
    cpf: "any_cpf",
    endereco: "any_endereco",
    cidade: cidade.model.getDescricao(),
  };
  const pessoaData2 = {
    nome: "any_nome",
    cpf: "any_cpf",
    endereco: "any_endereco",
    cidade: cidade.model.getDescricao(),
  };
  const pessoaData3 = {
    nome: "any_nome",
    cpf: "any_cpf",
    endereco: "any_endereco",
    cidade: cidade.model.getDescricao(),
  };

  const pessoa1 = await pessoasRepository.cadastrar(pessoaData1);
  const pessoa2 = await pessoasRepository.cadastrar(pessoaData2);
  const pessoa3 = await pessoasRepository.cadastrar(pessoaData3);

  return [
    { json: pessoaData1, model: pessoa1 },
    { json: pessoaData2, model: pessoa2 },
    { json: pessoaData3, model: pessoa3 },
  ];
}
