import { CacheRepository } from "../../../shared/cache/cache.repository";
import { Resultado, ResultadoDTO } from "../../../shared/utils";
import { CidadesRepository } from "../repository";

const CACHE_PREFIX = "cache-cidade";

export class ListarCidadesUsecase {
  async execute(filtro?: string): Promise<ResultadoDTO> {
    const cidadeRepository = new CidadesRepository();
    const cacheRepository = new CacheRepository();

    const filtroFormatado = (filtro || "all").toLowerCase().trim();
    const cacheKey = `${CACHE_PREFIX}:${filtroFormatado}`;

    const cidadesCache = await cacheRepository.get(cacheKey);

    if (cidadesCache) {
      return Resultado.sucesso(
        200,
        "Cidades listadas do cache com sucesso.",
        cidadesCache
      );
    }

    const cidadesDb = await cidadeRepository.listarCidades(filtro?.trim());
    const cidadesJson = cidadesDb.map((cidade) => cidade.toJson());

    await cacheRepository.set(cacheKey, cidadesJson);

    return Resultado.sucesso(
      200,
      "Cidades listadas do banco com sucesso.",
      cidadesJson
    );
  }
}
