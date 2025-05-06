import { CacheRepository } from "../../../shared/cache/cache.repository";
import {
  Resultado,
  ResultadoDTO,
} from "../../../shared/utils/resultado.helper";
import { CadastrarCidadeDto } from "../dto";
import { CidadesRepository } from "../repository";

const CACHE_PREFIX = "cache-cidade";

export class CadastrarCidadeUsecase {
  async execute(dados: CadastrarCidadeDto): Promise<ResultadoDTO> {
    const cidadeRepository = new CidadesRepository();
    const cacheRepository = new CacheRepository();

    const cidadeExistente = await cidadeRepository.verificarSeCidadeExiste(
      dados.descricao
    );

    if (cidadeExistente) return Resultado.erro(400, "Cidade já cadastrada.");

    const novaCidade = await cidadeRepository.cadastrar(dados);

    const nomeFiltro = dados.descricao.toLowerCase().trim();
    await Promise.all([
      cacheRepository.delete(`${CACHE_PREFIX}:all`),
      cacheRepository.delete(`${CACHE_PREFIX}:${nomeFiltro}`),
    ]);

    const cidadesDb = await cidadeRepository.listarCidades();
    const cacheAtualizado = cidadesDb.map((cidade) => cidade.toJson());

    await cacheRepository.set(`${CACHE_PREFIX}:all`, cacheAtualizado);

    return Resultado.sucesso(
      200,
      "Cidade criada com sucesso.",
      novaCidade.toJson()
    );
  }
}
