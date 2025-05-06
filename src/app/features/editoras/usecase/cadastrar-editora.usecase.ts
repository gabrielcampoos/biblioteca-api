import { CacheRepository } from "../../../shared/cache/cache.repository";
import {
  Resultado,
  ResultadoDTO,
} from "../../../shared/utils/resultado.helper";
import { CadastrarEditoraDto } from "../dto";
import { EditoraRepository } from "../repository";

const CACHE_PREFIX = "cache-editora";

export class CadastrarEditoraUsecase {
  async execute(dados: CadastrarEditoraDto): Promise<ResultadoDTO> {
    const editoraRepository = new EditoraRepository();
    const cacheRepository = new CacheRepository();

    const editoraExistente = await editoraRepository.verificarSeEditoraExiste(
      dados.nome
    );

    if (editoraExistente) {
      return Resultado.erro(400, "Editora já cadastrada.");
    }

    const novaEditora = await editoraRepository.cadastrar(dados);

    const nomeFiltro = dados.nome.toLowerCase().trim();
    await Promise.all([
      cacheRepository.delete(`${CACHE_PREFIX}:all`),
      cacheRepository.delete(`${CACHE_PREFIX}:${nomeFiltro}`),
    ]);

    const editorasDb = await editoraRepository.listarEditoras();
    const cacheAtualizado = editorasDb.map((editora) => editora.toJson());

    await cacheRepository.set(`${CACHE_PREFIX}:all`, cacheAtualizado);

    return Resultado.sucesso(
      200,
      "Editora criada com sucesso.",
      novaEditora.toJson()
    );
  }
}
