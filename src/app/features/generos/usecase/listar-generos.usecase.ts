import { CacheRepository } from "../../../shared/cache/cache.repository";
import { Resultado, ResultadoDTO } from "../../../shared/utils";
import { GenerosRepository } from "../repository";

const CACHE_PREFIX = "cache-genero";

export class ListarGenerosUsecase {
  async execute(filtro?: string): Promise<ResultadoDTO> {
    const generoRepository = new GenerosRepository();
    const cacheRepository = new CacheRepository();

    const cacheKey = `${CACHE_PREFIX}:${(filtro || "all")
      .toLowerCase()
      .trim()}`;
    const generosCache = await cacheRepository.get(cacheKey);

    if (generosCache) {
      return Resultado.sucesso(
        200,
        "Generos listados do cache com sucesso.",
        generosCache
      );
    }

    const generosDb = await generoRepository.listarGeneros(filtro);
    const generosJson = generosDb.map((genero) => genero.toJson());

    await cacheRepository.set(cacheKey, generosJson);

    return Resultado.sucesso(
      200,
      "Editoras listadas do banco com sucesso.",
      generosJson
    );
  }
}
