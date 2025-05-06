import { RedisConnection } from "../../../../../src/main/database/ioredis.connection";
import { DatabaseConnection } from "../../../../../src/main/database/typeorm.connection";
import { CadastrarAutorUsecase } from "../../../../../src/app/features/autor/usecase";
import { Autor, Cidade } from "../../../../../src/app/models";
import { AutorRepository } from "../../../../../src/app/features/autor/repository";

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

  beforeAll(() => {
    jest.clearAllMocks();
  });

  test("Deve retornar false quando chamar o método execute passando um nome que já existe na base de dados.", async () => {
    jest
      .spyOn(AutorRepository.prototype, "verificarSeAutorExiste")
      .mockResolvedValue(null);
  });

  test("Deve cadastrar um autor quando chamar o método execute passando um none que não existe na base de dados", async () => {
    const autorFake = new Autor("any_id", "any_nome");

    jest
      .spyOn(AutorRepository.prototype, "verificarSeAutorExiste")
      .mockResolvedValue(null);

    jest
      .spyOn(AutorRepository.prototype, "cadastrar")
      .mockResolvedValue(autorFake);

    const sut = createSut();

    const resultado = await sut.execute({
      nome: "any_nome",
    });

    expect(resultado).toEqual({
      codigo: 200,
      sucesso: true,
      mensagem: "Autor criado com sucesso.",
      dados: autorFake.toJson(),
    });
  });
});
