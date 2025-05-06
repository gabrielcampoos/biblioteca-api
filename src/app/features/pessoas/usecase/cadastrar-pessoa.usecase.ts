import { CacheRepository } from "../../../shared/cache/cache.repository";
import {
  Resultado,
  ResultadoDTO,
} from "../../../shared/utils/resultado.helper";
import { CadastrarPessoaDto } from "../dto";
import { PessoasRepository } from "../repository/pessoas.repository";

const CACHE_PREFIX = "cache-pessoa";

export class CadastrarPessoaUsecase {
  async execute(dados: CadastrarPessoaDto): Promise<ResultadoDTO> {
    const pessoaRepository = new PessoasRepository();
    const cacheRepository = new CacheRepository();

    const pessoaExistente = await pessoaRepository.verificarSePessoaExiste(
      dados.cpf
    );

    if (pessoaExistente) {
      return Resultado.erro(400, "Pessoa já cadastrada.");
    }

    const novaPessoa = await pessoaRepository.cadastrar(dados);

    const nomeFiltro = dados.cpf.toLowerCase().trim();
    await Promise.all([
      cacheRepository.delete(`${CACHE_PREFIX}:all`),
      cacheRepository.delete(`${CACHE_PREFIX}:${nomeFiltro}`),
    ]);

    const pessoasDb = await pessoaRepository.listarPessoas();
    const cacheAtualizado = pessoasDb.map((pessoa) => pessoa.toJson());

    await cacheRepository.set(`${CACHE_PREFIX}:all`, cacheAtualizado);

    return Resultado.sucesso(
      200,
      "Pessoa criada com sucesso.",
      novaPessoa.toJson()
    );
  }
}
