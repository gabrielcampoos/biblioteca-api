import { EditoraRepository } from "../../../src/app/features/editoras/repository";
import { cadastrarCidades } from "./cadastrar-cidades.builder";

export async function cadastrarEditoras() {
  const editorasRepository = new EditoraRepository();
  const [cidade] = await cadastrarCidades();

  const editoraData1 = {
    nome: "any_nome",
    cidade: cidade.model.getDescricao(),
  };
  const editoraData2 = {
    nome: "any_nome",
    cidade: cidade.model.getDescricao(),
  };
  const editoraData3 = {
    nome: "any_nome",
    cidade: cidade.model.getDescricao(),
  };

  const editora1 = await editorasRepository.cadastrar(editoraData1);
  const editora2 = await editorasRepository.cadastrar(editoraData2);
  const editora3 = await editorasRepository.cadastrar(editoraData3);

  return [
    { json: editoraData1, model: editora1 },
    { json: editoraData2, model: editora2 },
    { json: editoraData3, model: editora3 },
  ];
}
