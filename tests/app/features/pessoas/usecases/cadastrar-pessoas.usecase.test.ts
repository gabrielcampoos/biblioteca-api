import { RedisConnection } from "../../../../../src/main/database/ioredis.connection";
import { DatabaseConnection } from "../../../../../src/main/database/typeorm.connection";
import { CadastrarPessoaUsecase } from "../../../../../src/app/features/pessoas/usecase";
import { PessoasRepository } from "../../../../../src/app/features/pessoas/repository/pessoas.repository";
import { cadastrarPessoas } from "../../../helpers/cadastrar-pessoas.builder";
import { cadastrarCidades } from "../../../helpers/cadastrar-cidades.builder";

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

  afterEach(async () => {
    await new PessoasRepository().clear();
  });

  test("Deve retornar false quando chamar o método execute passando um cpf que já existe na base de dados.", async () => {
    const [pessoa] = await cadastrarPessoas();

    const sut = createSut();

    const resultado = await sut.execute({
      nome: pessoa.model.getNome(),
      cpf: pessoa.model.getCpf(),
      endereco: pessoa.model.getEndereco(),
      cidade: pessoa.model.getCidade().getDescricao(),
    });

    expect(resultado).toEqual({
      codigo: 400,
      sucesso: false,
      mensagem: "Pessoa já cadastrada.",
      dados: undefined,
    });
  });

  test("Deve cadastrar uma pessoa quando chamar o método execute passando um cpf que não existe na base de dados", async () => {
    const [cidade] = await cadastrarCidades();

    const sut = createSut();

    const resultado = await sut.execute({
      nome: "any_nome",
      cpf: "any_cpf",
      endereco: "any_endereco",
      cidade: cidade.model.getDescricao(),
    });

    expect(resultado.sucesso).toBe(true);
    expect(resultado.mensagem).toBe("Pessoa criada com sucesso.");
    expect(resultado.dados).toBeDefined();
  });
});
