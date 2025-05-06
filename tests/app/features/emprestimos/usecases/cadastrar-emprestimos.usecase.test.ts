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
import { PessoasRepository } from "../../../../../src/app/features/pessoas/repository/pessoas.repository";
import { cadastrarPessoas } from "../../../helpers/cadastrar-pessoas.builder";
import { cadastrarLivros } from "../../../helpers/cadastrar-livros.builder";

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

  afterEach(async () => {
    await new EmprestimosRepository().clear();
  });

  test("Deve cadastrar um emprestimo quando chamar o método execute passando um objeto", async () => {
    const [pessoa] = await cadastrarPessoas();
    const [livro] = await cadastrarLivros();

    const sut = createSut();

    const resultado = await sut.execute({
      pessoa: pessoa.model.getNome(),
      livro: livro.model.getNome(),
    });

    expect(resultado.sucesso).toBe(true);
    expect(resultado.mensagem).toBe("Emprestimo criado com sucesso.");
    expect(resultado.dados).toBeDefined();
  });
});
