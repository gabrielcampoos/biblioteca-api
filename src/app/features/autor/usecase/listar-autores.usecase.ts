import { CacheRepository } from "../../../shared/cache/cache.repository";
import { Resultado, ResultadoDTO } from "../../../shared/utils";
import { AutorRepository } from "../repository";

const CACHE_PREFIX = "cache-autor";

export class ListarAutoresUsecase {
  async execute(filtro?: string): Promise<ResultadoDTO> {
    const autorRepository = new AutorRepository();
    const cacheRepository = new CacheRepository();

    const cacheKey = `${CACHE_PREFIX}:${(filtro || "all")
      .toLowerCase()
      .trim()}`;
    const autoresCache = await cacheRepository.get(cacheKey);

    if (autoresCache) {
      return Resultado.sucesso(
        200,
        "Autores listados do cache com sucesso.",
        autoresCache
      );
    }

    const autoresDb = await autorRepository.listarAutores(filtro);
    const autoresJson = autoresDb.map((autor) => autor.toJson());

    await cacheRepository.set(cacheKey, autoresJson);

    return Resultado.sucesso(
      200,
      "Autores listados do banco com sucesso.",
      autoresJson
    );
  }
}
