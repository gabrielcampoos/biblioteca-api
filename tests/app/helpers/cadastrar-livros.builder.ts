import { LivrosRepository } from "../../../src/app/features/livros/repository";
import { cadastrarEditoras } from "./cadastrar-editoras.builder";
import { cadastrarAutores } from "./cadastrar-autores.builder";
import { cadastrarGeneros } from "./cadastrar-generos.builder";

export async function cadastrarLivros() {
  const livrosRepository = new LivrosRepository();
  const [editora] = await cadastrarEditoras();
  const [autor] = await cadastrarAutores();
  const [genero] = await cadastrarGeneros();

  const livroData1 = {
    nome: "any_nome",
    editora: editora.model.getNome(),
    autor: autor.model.getNome(),
    genero: genero.model.getDescricao(),
    disponivel: true,
  };
  const livroData2 = {
    nome: "any_nome",
    editora: editora.model.getNome(),
    autor: autor.model.getNome(),
    genero: genero.model.getDescricao(),
    disponivel: true,
  };
  const livroData3 = {
    nome: "any_nome",
    editora: editora.model.getNome(),
    autor: autor.model.getNome(),
    genero: genero.model.getDescricao(),
    disponivel: true,
  };

  const livro1 = await livrosRepository.cadastrar(livroData1);
  const livro2 = await livrosRepository.cadastrar(livroData2);
  const livro3 = await livrosRepository.cadastrar(livroData3);

  return [
    { json: livroData1, model: livro1 },
    { json: livroData2, model: livro2 },
    { json: livroData3, model: livro3 },
  ];
}
