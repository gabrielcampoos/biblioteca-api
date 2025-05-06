import { RedisConnection } from "../../../../../src/main/database/ioredis.connection";
import { DatabaseConnection } from "../../../../../src/main/database/typeorm.connection";
import { CadastrarEmprestimosUsecase } from "../../../../../src/app/features/emprestimos/usecase";
import {
  Autor,
  Cidade,
  Editora,
  Emprestimo,
  Genero,
  Livro,
  Pessoa,
} from "../../../../../src/app/models";
import { EmprestimosRepository } from "../../../../../src/app/features/emprestimos/repository";

describe("Testes para o usecase de cadastrar emprestimos.", () => {
  jest.mock("../../../../../src/app/features/emprestimos/repository");

  function createSut() {
    return new CadastrarEmprestimosUsecase();
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

  test("Deve cadastrar um emprestimo quando chamar o método execute passando um objeto", async () => {
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
    const pessoaFake = new Pessoa(
      "any_id",
      "any_nome",
      "any_cpf",
      "any_endereco",
      cidadeFake
    );
    const emprestimoFake = new Emprestimo("any_id", pessoaFake, livroFake);

    jest
      .spyOn(EmprestimosRepository.prototype, "cadastrarEmprestimo")
      .mockResolvedValue(emprestimoFake);

    const sut = createSut();

    const resultado = await sut.execute({
      pessoa: "any_pessoa",
      livro: "any_livro",
    });

    expect(resultado).toEqual({
      codigo: 200,
      sucesso: true,
      mensagem: "Emprestimo criado com sucesso.",
      dados: emprestimoFake.toJson(),
    });
  });
});
