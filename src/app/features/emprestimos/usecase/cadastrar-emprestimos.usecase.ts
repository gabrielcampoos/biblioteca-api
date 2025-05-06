import { CacheRepository } from "../../../shared/cache/cache.repository";
import {
  Resultado,
  ResultadoDTO,
} from "../../../shared/utils/resultado.helper";
import { CadastrarEmprestimoDto } from "../dto";
import { EmprestimosRepository } from "../repository";

const CACHE_PREFIX = "cache-emprestimo";

export class CadastrarEmprestimosUsecase {
  async execute(dados: CadastrarEmprestimoDto): Promise<ResultadoDTO> {
    const emprestimoRepository = new EmprestimosRepository();
    const cacheRepository = new CacheRepository();
    const novoEmprestimo = await emprestimoRepository.cadastrarEmprestimo(
      dados
    );

    await cacheRepository.delete(CACHE_PREFIX)
    const nomeFiltro = dados.pessoa.toLowerCase().trim();
    await Promise.all([
      cacheRepository.delete(`${CACHE_PREFIX}:all`),
      cacheRepository.delete(`${CACHE_PREFIX}:${nomeFiltro}`),
      cacheRepository.delete("cache-emprestimos-atrasados"),
    ]);

    const emprestimosDb = await emprestimoRepository.listarEmprestimos();
    const cacheAtualizado = emprestimosDb.map((emprestimo) =>
      emprestimo.toJson()
    );

    await cacheRepository.set(`${CACHE_PREFIX}:all`, cacheAtualizado);

    return Resultado.sucesso(
      200,
      "Emprestimo criado com sucesso.",
      novoEmprestimo.toJson()
    );
  }
}
