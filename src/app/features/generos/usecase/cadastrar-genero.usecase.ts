import { CacheRepository } from "../../../shared/cache/cache.repository";
import {
  Resultado,
  ResultadoDTO,
} from "../../../shared/utils/resultado.helper";
import { CadastrarGeneroDto } from "../dto";
import { GenerosRepository } from "../repository";

const CACHE_PREFIX = "cache-genero";

export class CadastrarGeneroUsecase {
  async execute(dados: CadastrarGeneroDto): Promise<ResultadoDTO> {
    const generoRepositoy = new GenerosRepository();
    const cacheRepository = new CacheRepository();

    const generoExistente = await generoRepositoy.verificarSeGeneroExiste(
      dados.descricao
    );

    if (generoExistente) {
      return Resultado.erro(400, "Genero já cadastrado.");
    }

    const novoGenero = await generoRepositoy.cadastrar(dados);

    const nomeFiltro = dados.descricao.toLowerCase().trim();
    await Promise.all([
      cacheRepository.delete(`${CACHE_PREFIX}:all`),
      cacheRepository.delete(`${CACHE_PREFIX}:${nomeFiltro}`),
    ]);

    const generosDb = await generoRepositoy.listarGeneros();
    const cacheAtualizado = generosDb.map((genero) => genero.toJson());

    await cacheRepository.set(`${CACHE_PREFIX}:all`, cacheAtualizado);

    return Resultado.sucesso(
      200,
      "Genero criado com sucesso.",
      novoGenero.toJson()
    );
  }
}
