import { RedisConnection } from "../../../../../src/main/database/ioredis.connection";
import { DatabaseConnection } from "../../../../../src/main/database/typeorm.connection";
import { CadastrarCidadeUsecase } from "../../../../../src/app/features/cidades/usecase";
import { CidadesRepository } from "../../../../../src/app/features/cidades/repository";
import { cadastrarCidades } from "../../../helpers/cadastrar-cidades.builder";

describe("Testes para o usecase de cadastrar cidades.", () => {
  jest.mock("../../../../../src/app/features/cidades/repository");

  function createSut() {
    return new CadastrarCidadeUsecase();
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
    await new CidadesRepository().clear();
  });

  test("Deve retornar false quando chamar o método execute passando uma descrição que já existe na base de dados.", async () => {
    const [cidade] = await cadastrarCidades();

    const sut = createSut();

    const resultado = await sut.execute({
      descricao: cidade.model.getDescricao(),
      uf: cidade.model.getUf(),
    });

    expect(resultado).toEqual({
      codigo: 400,
      sucesso: false,
      mensagem: "Cidade já cadastrada.",
      dados: undefined,
    });
  });

  test("Deve cadastrar uma cidade quando chamar o método execute passando uma descrição que não existe na base de dados", async () => {
    const sut = createSut();

    const resultado = await sut.execute({
      descricao: "any_descricao",
      uf: "any_uf",
    });

    expect(resultado.sucesso).toBe(true);
    expect(resultado.mensagem).toBe("Cidade criada com sucesso.");
    expect(resultado.dados).toBeDefined();
  });
});
