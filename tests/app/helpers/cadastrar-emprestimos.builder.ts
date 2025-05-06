import { EmprestimosRepository } from "../../../src/app/features/emprestimos/repository";
import { cadastrarPessoas } from "./cadastrar-pessoas.builder";
import { cadastrarLivros } from "./cadastrar-livros.builder";

export async function cadastrarEmprestimos() {
  const emprestimosRepository = new EmprestimosRepository();
  const [pessoa] = await cadastrarPessoas();
  const [livro] = await cadastrarLivros();

  const emprestimoData1 = {
    pessoa: pessoa.model.getNome(),
    livro: livro.model.getNome(),
  };
  const emprestimoData2 = {
    pessoa: pessoa.model.getNome(),
    livro: livro.model.getNome(),
  };
  const emprestimoData3 = {
    pessoa: pessoa.model.getNome(),
    livro: livro.model.getNome(),
  };

  const emprestimo1 = await emprestimosRepository.cadastrarEmprestimo(
    emprestimoData1
  );
  const emprestimo2 = await emprestimosRepository.cadastrarEmprestimo(
    emprestimoData2
  );
  const emprestimo3 = await emprestimosRepository.cadastrarEmprestimo(
    emprestimoData3
  );

  return [
    { json: emprestimoData1, model: emprestimo1 },
    { json: emprestimoData2, model: emprestimo2 },
    { json: emprestimoData3, model: emprestimo3 },
  ];
}
