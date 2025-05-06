import { CacheRepository } from "../../../shared/cache/cache.repository";
import {
  Resultado,
  ResultadoDTO,
} from "../../../shared/utils/resultado.helper";
import { CadastrarLivroDto } from "../dto";
import { LivrosRepository } from "../repository";

const CACHE_PREFIX = "cache-livro";

export class CadastrarLivroUsecase {
  async execute(dados: CadastrarLivroDto): Promise<ResultadoDTO> {
    const livroRepository = new LivrosRepository();
    const cacheRepository = new CacheRepository();

    const livroExistente = await livroRepository.verificarSeLivroExiste(
      dados.nome
    );

    if (livroExistente) {
      return Resultado.erro(400, "Livro já cadastrado.");
    }

    const novoLivro = await livroRepository.cadastrar(dados);

    const nomeFiltro = dados.nome.toLowerCase().trim();
    await Promise.all([
      cacheRepository.delete(`${CACHE_PREFIX}:all`),
      cacheRepository.delete(`${CACHE_PREFIX}:${nomeFiltro}`),
    ]);

    const livrosDb = await livroRepository.listarLivros();
    const cacheAtualizado = livrosDb.map((livro) => livro.toJson());

    await cacheRepository.set(`${CACHE_PREFIX}:all`, cacheAtualizado);

    return Resultado.sucesso(
      200,
      "Livro criado com sucesso.",
      novoLivro.toJson()
    );
  }
}
