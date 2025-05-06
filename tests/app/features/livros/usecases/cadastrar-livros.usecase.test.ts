import { RedisConnection } from "../../../../../src/main/database/ioredis.connection";
import { DatabaseConnection } from "../../../../../src/main/database/typeorm.connection";
import { CadastrarLivroUsecase } from "../../../../../src/app/features/livros/usecase";
import { LivrosRepository } from "../../../../../src/app/features/livros/repository";
import { cadastrarLivros } from "../../../helpers/cadastrar-livros.builder";
import { cadastrarEditoras } from "../../../helpers/cadastrar-editoras.builder";
import { cadastrarAutores } from "../../../helpers/cadastrar-autores.builder";
import { cadastrarGeneros } from "../../../helpers/cadastrar-generos.builder";

describe("Testes para o usecase de cadastrar livros.", () => {
  jest.mock("../../../../../src/app/features/livros/repository");

  function createSut() {
    return new CadastrarLivroUsecase();
  }

  beforeAll(async () => {
    await DatabaseConnection.connect();
    await RedisConnection.connect();
  });

  afterAll(async () => {
    await DatabaseConnection.destroy();
    await RedisConnection.destroy();
  });

  afterEach(async () => {
    await new LivrosRepository().clear();
  });

  test("Deve retornar false quando chamar o método execute passando um nome que já existe na base de dados.", async () => {
    const [livro] = await cadastrarLivros();

    const sut = createSut();

    const resultado = await sut.execute({
      nome: livro.model.getNome(),
      editora: livro.model.getEditora().getNome(),
      autor: livro.model.getAutor().getNome(),
      genero: livro.model.getGenero().getDescricao(),
      disponivel: true,
    });

    expect(resultado).toEqual({
      codigo: 400,
      dados: undefined,
      mensagem: "Livro já cadastrado.",
      sucesso: false,
    });
  });

  test("Deve cadastrar um livro quando chamar o método execute passando um nome que não existe na base de dados", async () => {
    const [editora] = await cadastrarEditoras();
    const [autor] = await cadastrarAutores();
    const [genero] = await cadastrarGeneros();

    const sut = createSut();

    const resultado = await sut.execute({
      nome: "any_nome",
      editora: editora.model.getNome(),
      autor: autor.model.getNome(),
      genero: genero.model.getDescricao(),
      disponivel: true,
    });

    expect(resultado.sucesso).toBe(true);
    expect(resultado.mensagem).toBe("Livro criado com sucesso.");
    expect(resultado.dados).toBeDefined();
  });
});
