import { CacheRepository } from "../../../shared/cache/cache.repository";
import { Resultado, ResultadoDTO } from "../../../shared/utils";
import { EmprestimosRepository } from "../repository";

const CACHE_PREFIX = "cache-emprestimo";

export class ListarEmprestimosUsecase {
  async execute(filtro?: string): Promise<ResultadoDTO> {
    const emprestimoRepository = new EmprestimosRepository();
    const cacheRepository = new CacheRepository();

    const filtroFormatado = (filtro || "all").toLowerCase().trim();
    const cacheKey = `${CACHE_PREFIX}:${filtroFormatado}`;

    const emprestimosCache = await cacheRepository.get(cacheKey);

    if (emprestimosCache) {
      return Resultado.sucesso(
        200,
        "Emprestimos listados do cache com sucesso.",
        emprestimosCache
      );
    }

    const emprestimosDb = await emprestimoRepository.listarEmprestimos(
      filtroFormatado === "all" ? undefined : filtroFormatado
    );
    const emprestimosJson = emprestimosDb.map((emprestimo) =>
      emprestimo.toJson()
    );

    await cacheRepository.set(cacheKey, emprestimosJson);

    return Resultado.sucesso(
      200,
      "Emprestimos listados do banco com sucesso.",
      emprestimosJson
    );
  }
}
