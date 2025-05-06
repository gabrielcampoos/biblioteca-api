import { RedisConnection } from "../../../../../src/main/database/ioredis.connection";
import { DatabaseConnection } from "../../../../../src/main/database/typeorm.connection";
import { CadastrarAutorUsecase } from "../../../../../src/app/features/autor/usecase";
import { AutorRepository } from "../../../../../src/app/features/autor/repository";
import { cadastrarAutores } from "../../../helpers/cadastrar-autores.builder";

describe("Testes para o usecase de cadastrar autores.", () => {
  jest.mock("../../../../../src/app/features/autor/repository");

  function createSut() {
    return new CadastrarAutorUsecase();
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
    await new AutorRepository().clear();
  });

  test("Deve retornar false quando chamar o método execute passando um nome que já existe na base de dados.", async () => {
    const [autor] = await cadastrarAutores();

    const sut = createSut();

    const resultado = await sut.execute({
      nome: autor.model.getNome(),
    });

    expect(resultado).toEqual({
      codigo: 400,
      sucesso: false,
      mensagem: "Autor já cadastrado.",
      dados: undefined,
    });
  });

  test("Deve cadastrar um autor quando chamar o método execute passando um none que não existe na base de dados", async () => {
    const sut = createSut();

    const resultado = await sut.execute({
      nome: "any_nome",
    });

    expect(resultado.sucesso).toBe(true);
    expect(resultado.mensagem).toBe("Autor criado com sucesso.");
    expect(resultado.dados).toBeDefined();
  });
});
