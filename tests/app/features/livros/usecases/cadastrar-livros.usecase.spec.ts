import { RedisConnection } from "../../../../../src/main/database/ioredis.connection";
import { DatabaseConnection } from "../../../../../src/main/database/typeorm.connection";
import { CadastrarLivroUsecase } from "../../../../../src/app/features/livros/usecase";
import { LivrosRepository } from "../../../../../src/app/features/livros/repository";
import {
  Autor,
  Cidade,
  Editora,
  Genero,
  Livro,
} from "../../../../../src/app/models";

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

  beforeAll(() => {
    jest.clearAllMocks();
  });

  test("Deve retornar false quando chamar o método execute passando um nome que já existe na base de dados.", async () => {
    const cidadeFake = new Cidade("any_id", "any_descricao", "any_uf");
    const editoraFake = new Editora("any_id", "any_nome", cidadeFake);
    const autorFake = new Autor("any_id", "any_nome");
    const generoFake = new Genero("any_id", "any_descricao");
    const livroFake = new Livro(
      "any_id",
      "any_nome",
      editoraFake,
      autorFake,
      generoFake,
      true
    );

    jest
      .spyOn(LivrosRepository.prototype, "verificarSeLivroExiste")
      .mockResolvedValue(livroFake);

    const sut = createSut();

    const resultado = await sut.execute({
      nome: "any_nome",
      editora: "any_editora",
      autor: "any_autor",
      genero: "any_genero",
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
    const cidadeFake = new Cidade("any_id", "any_descricao", "any_uf");
    const editoraFake = new Editora("any_id", "any_nome", cidadeFake);
    const autorFake = new Autor("any_id", "any_nome");
    const generoFake = new Genero("any_id", "any_descricao");
    const livroFake = new Livro(
      "any_id",
      "any_nome",
      editoraFake,
      autorFake,
      generoFake,
      true
    );

    jest
      .spyOn(LivrosRepository.prototype, "verificarSeLivroExiste")
      .mockResolvedValue(null);

    jest
      .spyOn(LivrosRepository.prototype, "cadastrar")
      .mockResolvedValue(livroFake);

    const sut = createSut();

    const resultado = await sut.execute({
      nome: "any_nome",
      editora: "any_editora",
      autor: "any_autor",
      genero: "any_genero",
      disponivel: true,
    });

    expect(resultado).toEqual({
      codigo: 200,
      sucesso: true,
      mensagem: "Livro criado com sucesso.",
      dados: livroFake.toJson(),
    });
  });
});
