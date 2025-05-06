import { RedisConnection } from "../../../../../src/main/database/ioredis.connection";
import { DatabaseConnection } from "../../../../../src/main/database/typeorm.connection";
import { CadastrarPessoaUsecase } from "../../../../../src/app/features/pessoas/usecase";
import { PessoasRepository } from "../../../../../src/app/features/pessoas/repository/pessoas.repository";
import { Cidade, Pessoa } from "../../../../../src/app/models";

describe("Testes para o usecase de cadastrar pessoas.", () => {
  jest.mock("../../../../../src/app/features/pessoas/repository");

  function createSut() {
    return new CadastrarPessoaUsecase();
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

  test("Deve retornar false quando chamar o método execute passando um cpf que já existe na base de dados.", async () => {
    jest
      .spyOn(PessoasRepository.prototype, "verificarSePessoaExiste")
      .mockResolvedValue(null);
  });

  test("Deve cadastrar uma pessoa quando chamar o método execute passando um cpf que não existe na base de dados", async () => {
    const cidadeFake = new Cidade("any_id", "any_descricao", "any_uf");
    const pessoaFake = new Pessoa(
      "any_id",
      "any_nome",
      "any_cpf",
      "any_endereco",
      cidadeFake
    );

    jest
      .spyOn(PessoasRepository.prototype, "verificarSePessoaExiste")
      .mockResolvedValue(null);

    jest
      .spyOn(PessoasRepository.prototype, "cadastrar")
      .mockResolvedValue(pessoaFake);

    const sut = createSut();

    const resultado = await sut.execute({
      nome: "any_nome",
      cpf: "any_cpf",
      endereco: "any_endereco",
      cidade: "any_cidade",
    });

    expect(resultado).toEqual({
      codigo: 200,
      sucesso: true,
      mensagem: "Pessoa criada com sucesso.",
      dados: pessoaFake.toJson(),
    });
  });
});
