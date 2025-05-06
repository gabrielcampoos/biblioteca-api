import { AutorRepository } from "../../../src/app/features/autor/repository";

export async function cadastrarAutores() {
  const autoresRepository = new AutorRepository();

  const autorData1 = {
    nome: "any_nome",
  };
  const autorData2 = {
    nome: "any_nome",
  };
  const autorData3 = {
    nome: "any_nome",
  };

  const autor1 = await autoresRepository.cadastrar(autorData1);
  const autor2 = await autoresRepository.cadastrar(autorData2);
  const autor3 = await autoresRepository.cadastrar(autorData3);

  return [
    { json: autorData1, model: autor1 },
    { json: autorData2, model: autor2 },
    { json: autorData3, model: autor3 },
  ];
}
