import { CacheRepository } from "../../../shared/cache/cache.repository";
import { Resultado, ResultadoDTO } from "../../../shared/utils";
import { LivrosRepository } from "../repository";

const CACHE_PREFIX = "cache-livro";

export class ListarLivrosUsecase {
  async execute(filtro?: string): Promise<ResultadoDTO> {
    const livrosRepository = new LivrosRepository();
    const cacheRepository = new CacheRepository();

    const filtroFormatado = (filtro || "all").toLowerCase().trim();
    const cacheKey = `${CACHE_PREFIX}:${filtroFormatado}`;

    const livrosCache = await cacheRepository.get(cacheKey);

    if (livrosCache) {
      return Resultado.sucesso(
        200,
        "Livros listados do cache com sucesso.",
        livrosCache
      );
    }

    const livrosDb = await livrosRepository.listarLivros(filtro?.trim());
    const livrosJson = livrosDb.map((livro) => livro.toJson());

    await cacheRepository.set(cacheKey, livrosJson);

    return Resultado.sucesso(
      200,
      "Livros listados do banco com sucesso.",
      livrosJson
    );
  }
}
