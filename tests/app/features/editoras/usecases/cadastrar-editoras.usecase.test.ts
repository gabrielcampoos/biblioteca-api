import { RedisConnection } from "../../../../../src/main/database/ioredis.connection";
import { DatabaseConnection } from "../../../../../src/main/database/typeorm.connection";
import { CadastrarEditoraUsecase } from "../../../../../src/app/features/editoras/usecase";
import { EditoraRepository } from "../../../../../src/app/features/editoras/repository";
import { cadastrarEditoras } from "../../../helpers/cadastrar-editoras.builder";
import { cadastrarCidades } from "../../../helpers/cadastrar-cidades.builder";

describe("Testes para o usecase de cadastrar editoras.", () => {
  jest.mock("../../../../../src/app/features/editoras/repository");

  function createSut() {
    return new CadastrarEditoraUsecase();
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
    await new EditoraRepository().clear();
  });

  test("Deve retornar false quando chamar o método execute passando um nome que já existe na base de dados.", async () => {
    const [editora] = await cadastrarEditoras();

    const sut = createSut();

    const resultado = await sut.execute({
      nome: editora.model.getNome(),
      cidade: editora.model.getCidade().getDescricao(),
    });

    expect(resultado).toEqual({
      codigo: 400,
      sucesso: false,
      mensagem: "Editora já cadastrada.",
      dados: undefined,
    });
  });

  test("Deve cadastrar uma editora quando chamar o método execute passando um nome que não existe na base de dados", async () => {
    const [cidade] = await cadastrarCidades();

    const sut = createSut();

    const resultado = await sut.execute({
      nome: "any_nome",
      cidade: cidade.model.getDescricao(),
    });

    expect(resultado.sucesso).toBe(true);
    expect(resultado.mensagem).toBe("Editora criada com sucesso.");
    expect(resultado.dados).toBeDefined();
  });
});
