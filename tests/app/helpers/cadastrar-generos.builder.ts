import { GenerosRepository } from "../../../src/app/features/generos/repository";

export async function cadastrarGeneros() {
  const generosRepository = new GenerosRepository();

  const generoData1 = {
    descricao: "any_descricao",
  };
  const generoData2 = {
    descricao: "any_descricao",
  };
  const generoData3 = {
    descricao: "any_descricao",
  };

  const genero1 = await generosRepository.cadastrar(generoData1);
  const genero2 = await generosRepository.cadastrar(generoData2);
  const genero3 = await generosRepository.cadastrar(generoData3);

  return [
    { json: generoData1, model: genero1 },
    { json: generoData2, model: genero2 },
    { json: generoData3, model: genero3 },
  ];
}
