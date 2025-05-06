import { RedisConnection } from "../../../../../src/main/database/ioredis.connection";
import { DatabaseConnection } from "../../../../../src/main/database/typeorm.connection";
import { CadastrarGeneroUsecase } from "../../../../../src/app/features/generos/usecase";
import { Genero } from "../../../../../src/app/models";
import { GenerosRepository } from "../../../../../src/app/features/generos/repository";
import { cadastrarGeneros } from "../../../helpers/cadastrar-generos.builder";

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

  afterEach(async () => {
    await new GenerosRepository().clear();
  });

  test("Deve retornar false quando chamar o método execute passando uma descrição que já existe na base de dados.", async () => {
    const [genero] = await cadastrarGeneros();

    const sut = createSut();

    const resultado = await sut.execute({
      descricao: genero.model.getDescricao(),
    });

    expect(resultado).toEqual({
      codigo: 400,
      sucesso: false,
      mensagem: "Genero já cadastrado.",
      dados: undefined,
    });
  });

  test("Deve cadastrar um genero quando chamar o método execute passando uma descrição que não existe na base de dados", async () => {
    const sut = createSut();

    const resultado = await sut.execute({
      descricao: "any_descricao",
    });

    expect(resultado.sucesso).toBe(true);
    expect(resultado.mensagem).toBe("Genero criado com sucesso.");
    expect(resultado.dados).toBeDefined();
  });
});
