import { CacheRepository } from "../../../shared/cache/cache.repository";
import { Resultado, ResultadoDTO } from "../../../shared/utils";
import { EmprestimosRepository } from "../repository";

const CACHE_KEY = "cache-emprestimos-atrasados";

export class ListarEmprestimosAtrasadosUsecase {
  async execute(): Promise<ResultadoDTO> {
    const emprestimoRepository = new EmprestimosRepository();
    const cacheRepository = new CacheRepository();

    await cacheRepository.delete(CACHE_KEY)
    const emprestimosCache = await cacheRepository.get(CACHE_KEY);

    if (emprestimosCache) {
      return Resultado.sucesso(
        200,
        "Empréstimos em atraso listados do cache com sucesso.",
        emprestimosCache
      );
    }

    const emprestimosAtrasados =
      await emprestimoRepository.listarEmprestimosEmAtraso();

    await cacheRepository.set(CACHE_KEY, emprestimosAtrasados);

    return Resultado.sucesso(
      200,
      "Empréstimos em atraso listados do banco com sucesso.",
      emprestimosAtrasados
    );
  }
}
