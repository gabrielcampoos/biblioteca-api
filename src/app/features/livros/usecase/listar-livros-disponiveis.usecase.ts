import { Resultado, ResultadoDTO } from "../../../shared/utils";
import { LivrosRepository } from "../repository";

export class ListarLivrosDisponiveisUsecase {
  async execute(): Promise<ResultadoDTO> {
    const livrosRepository = new LivrosRepository();

    const livrosDb = await livrosRepository.listarLivrosDisponiveis();
    const livrosJson = livrosDb.map((livro) => livro.toJson());

    return Resultado.sucesso(
      200,
      "Livros listados do banco com sucesso.",
      livrosJson
    );
  }
}
