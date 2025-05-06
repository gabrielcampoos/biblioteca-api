import { CacheRepository } from "../../../shared/cache/cache.repository";
import { Resultado, ResultadoDTO } from "../../../shared/utils";
import { EditoraRepository } from "../repository";

const CACHE_PREFIX = "cache-editora";

export class ListarEditorasUsecase {
  async execute(filtro?: string): Promise<ResultadoDTO> {
    const editoraRepository = new EditoraRepository();
    const cacheRepository = new CacheRepository();

    const filtroFormatado = (filtro || "all").toLowerCase().trim();
    const cacheKey = `${CACHE_PREFIX}:${filtroFormatado}`;

    const editorasCache = await cacheRepository.get(cacheKey);

    if (editorasCache) {
      return Resultado.sucesso(
        200,
        "Editoras listadas do cache com sucesso.",
        editorasCache
      );
    }

    const editorasDb = await editoraRepository.listarEditoras(filtro?.trim());
    const editorasJson = editorasDb.map((editora) => editora.toJson());

    await cacheRepository.set(cacheKey, editorasJson);

    return Resultado.sucesso(
      200,
      "Editoras listadas do banco com sucesso.",
      editorasJson
    );
  }
}
