import { CidadesRepository } from "../../../src/app/features/cidades/repository";

export async function cadastrarCidades() {
  const cidadesRepository = new CidadesRepository();

  const cidadeData1 = {
    descricao: "any_descricao",
    uf: "any_uf",
  };
  const cidadeData2 = {
    descricao: "any_descricao",
    uf: "any_uf",
  };
  const cidadeData3 = {
    descricao: "any_descricao",
    uf: "any_uf",
  };

  const cidade1 = await cidadesRepository.cadastrar(cidadeData1);
  const cidade2 = await cidadesRepository.cadastrar(cidadeData2);
  const cidade3 = await cidadesRepository.cadastrar(cidadeData3);

  return [
    { json: cidadeData1, model: cidade1 },
    { json: cidadeData2, model: cidade2 },
    { json: cidadeData3, model: cidade3 },
  ];
}
