import { RedisConnection } from "../../../../../src/main/database/ioredis.connection";
import { DatabaseConnection } from "../../../../../src/main/database/typeorm.connection";
import { CadastrarEditoraUsecase } from "../../../../../src/app/features/editoras/usecase";
import { PessoasRepository } from "../../../../../src/app/features/pessoas/repository/pessoas.repository";
import { Cidade, Editora, Pessoa } from "../../../../../src/app/models";
import { EditoraRepository } from "../../../../../src/app/features/editoras/repository";

describe("Testes para o usecase de cadastrar editoras.", () => {
  jest.mock("../../../../../src/app/features/pessoas/repository");

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

  beforeAll(() => {
    jest.clearAllMocks();
  });

  test("Deve retornar false quando chamar o método execute passando um nome que já existe na base de dados.", async () => {
    jest
      .spyOn(EditoraRepository.prototype, "verificarSeEditoraExiste")
      .mockResolvedValue(null);
  });

  test("Deve cadastrar uma editora quando chamar o método execute passando um nome que não existe na base de dados", async () => {
    const cidadeFake = new Cidade("any_id", "any_descricao", "any_uf");
    const editoraFake = new Editora("any_id", "any_nome", cidadeFake);

    jest
      .spyOn(EditoraRepository.prototype, "verificarSeEditoraExiste")
      .mockResolvedValue(null);

    jest
      .spyOn(EditoraRepository.prototype, "cadastrar")
      .mockResolvedValue(editoraFake);

    const sut = createSut();

    const resultado = await sut.execute({
      nome: "any_nome",
      cidade: "any_cidade",
    });

    expect(resultado).toEqual({
      codigo: 200,
      sucesso: true,
      mensagem: "Editora criada com sucesso.",
      dados: editoraFake.toJson(),
    });
  });
});
