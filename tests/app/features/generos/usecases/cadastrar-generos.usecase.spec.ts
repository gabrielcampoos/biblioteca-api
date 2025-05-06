import { RedisConnection } from "../../../../../src/main/database/ioredis.connection";
import { DatabaseConnection } from "../../../../../src/main/database/typeorm.connection";
import { CadastrarGeneroUsecase } from "../../../../../src/app/features/generos/usecase";
import { Autor, Cidade, Genero } from "../../../../../src/app/models";
import { AutorRepository } from "../../../../../src/app/features/autor/repository";
import { GenerosRepository } from "../../../../../src/app/features/generos/repository";

describe("Testes para o usecase de cadastrar generos.", () => {
  jest.mock("../../../../../src/app/features/generos/repository");

  function createSut() {
    return new CadastrarGeneroUsecase();
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

  test("Deve retornar false quando chamar o método execute passando uma descrição que já existe na base de dados.", async () => {
    jest
      .spyOn(GenerosRepository.prototype, "verificarSeGeneroExiste")
      .mockResolvedValue(null);
  });

  test("Deve cadastrar um genero quando chamar o método execute passando uma descrição que não existe na base de dados", async () => {
    const generoFake = new Genero("any_id", "any_descricao");

    jest
      .spyOn(GenerosRepository.prototype, "verificarSeGeneroExiste")
      .mockResolvedValue(null);

    jest
      .spyOn(GenerosRepository.prototype, "cadastrar")
      .mockResolvedValue(generoFake);

    const sut = createSut();

    const resultado = await sut.execute({
      descricao: "any_descricao",
    });

    expect(resultado).toEqual({
      codigo: 200,
      sucesso: true,
      mensagem: "Genero criado com sucesso.",
      dados: generoFake.toJson(),
    });
  });
});
