import { Resultado, ResultadoDTO } from "../../../shared/utils";
import { EmprestimosRepository } from "../repository";
import { CacheRepository } from "../../../shared/cache/cache.repository";

const CACHE_PREFIX = "cache-emprestimo";

export class DevolverEmprestimoUsecase {
  async execute(id: string): Promise<ResultadoDTO> {
    const emprestimosRepository = new EmprestimosRepository();
    const cacheRepository = new CacheRepository();

    const emprestimo = await emprestimosRepository.buscarEmprestimoPorId(id);

    if (!emprestimo) {
      return Resultado.erro(404, "Empréstimo não encontrado.");
    }

    if (emprestimo.getDataEfetivaDevolucao()) {
      return Resultado.erro(400, "O livro já foi devolvido anteriormente.");
    }

    emprestimo.setDataEfetivaDevolucao(new Date());

    const devolucao = await emprestimosRepository.devolverEmprestimo(
      emprestimo
    );

    await cacheRepository.delete(CACHE_PREFIX);
    const nomeFiltro = id.trim();
    await Promise.all([
      cacheRepository.delete(`${CACHE_PREFIX}:all`),
      cacheRepository.delete(`${CACHE_PREFIX}:${nomeFiltro}`),
    ]);

    const emprestimosDb = await emprestimosRepository.listarEmprestimos();
    const cacheAtualizado = emprestimosDb.map((emprestimo) =>
      emprestimo.toJson()
    );

    await cacheRepository.set(`${CACHE_PREFIX}:all`, cacheAtualizado);

    return Resultado.sucesso(
      200,
      "Livro devolvido com sucesso.",
      devolucao?.toJson()
    );
  }
}
