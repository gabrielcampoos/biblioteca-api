import { CacheRepository } from "../../../shared/cache/cache.repository";
import {
  Resultado,
  ResultadoDTO,
} from "../../../shared/utils/resultado.helper";
import { CadastrarAutorDto } from "../dto";
import { AutorRepository } from "../repository";

const CACHE_PREFIX = "cache-autor";

export class CadastrarAutorUsecase {
  async execute(dados: CadastrarAutorDto): Promise<ResultadoDTO> {
    const autorRepository = new AutorRepository();
    const cacheRepository = new CacheRepository();

    const autorExistente = await autorRepository.verificarSeAutorExiste(
      dados.nome
    );

    if (autorExistente) {
      return Resultado.erro(400, "Autor já cadastrado.");
    }

    const novoAutor = await autorRepository.cadastrar(dados);

    const nomeFiltro = dados.nome.toLowerCase().trim();
    await Promise.all([
      cacheRepository.delete(`${CACHE_PREFIX}:all`),
      cacheRepository.delete(`${CACHE_PREFIX}:${nomeFiltro}`),
    ]);

    const autoresDb = await autorRepository.listarAutores();
    const cacheAtualizado = autoresDb.map((autor) => autor.toJson());

    await cacheRepository.set(`${CACHE_PREFIX}:all`, cacheAtualizado);

    return Resultado.sucesso(
      200,
      "Autor criado com sucesso.",
      novoAutor.toJson()
    );
  }
}
