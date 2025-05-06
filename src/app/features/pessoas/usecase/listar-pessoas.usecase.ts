import { CacheRepository } from "../../../shared/cache/cache.repository";
import { Resultado, ResultadoDTO } from "../../../shared/utils";
import { PessoasRepository } from "../repository/pessoas.repository";

const CACHE_PREFIX = "cache-pessoa";

export class ListarPessoasUsecase {
  async execute(filtro?: string): Promise<ResultadoDTO> {
    const pessoasRepository = new PessoasRepository();
    const cacheRepository = new CacheRepository();

    const filtroFormatado = (filtro || "all").toLowerCase().trim();
    const cacheKey = `${CACHE_PREFIX}:${filtroFormatado}`;

    const pessoasCache = await cacheRepository.get(cacheKey);

    if (pessoasCache) {
      return Resultado.sucesso(
        200,
        "Pessoas listadas do cache com sucesso.",
        pessoasCache
      );
    }

    const pessoasDb = await pessoasRepository.listarPessoas(filtro?.trim());
    const pessoasJson = pessoasDb.map((pessoa) => pessoa.toJson());

    await cacheRepository.set(cacheKey, pessoasJson);

    return Resultado.sucesso(
      200,
      "Pessoas listadas do banco com sucesso.",
      pessoasJson
    );
  }
}
