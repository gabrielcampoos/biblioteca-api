import { Request, Response } from "express";
import { httpHelper } from "../../../shared/utils";
import { Resultado } from "../../../shared/utils/resultado.helper";
import { CadastrarLivroDto } from "../dto";
import {
  CadastrarLivroUsecase,
  ListarLivrosDisponiveisUsecase,
  ListarLivrosIndisponiveisUsecase,
  ListarLivrosUsecase,
} from "../usecase";

export class LivrosController {
  static async cadastrarLivro(req: Request, res: Response) {
    const livro: CadastrarLivroDto = req.body;

    try {
      const usecase = new CadastrarLivroUsecase();

      const resultado = await usecase.execute(livro);

      if (!resultado.sucesso) return httpHelper.badRequestError(res, resultado);

      return httpHelper.success(res, resultado);
    } catch (erro: any) {
      return httpHelper.badRequestError(
        res,
        Resultado.erro(500, erro.toString())
      );
    }
  }

  static async listarLivros(req: Request, res: Response) {
    const { filtro } = req.query;

    try {
      const usecase = new ListarLivrosUsecase();

      const resultado = await usecase.execute(filtro as string);

      if (!resultado.sucesso) return httpHelper.badRequestError(res, resultado);

      return httpHelper.success(res, resultado);
    } catch (erro: any) {
      return httpHelper.badRequestError(
        res,
        Resultado.erro(500, erro.toString())
      );
    }
  }

  static async listarLivrosIndisponiveis(req: Request, res: Response) {
    try {
      const usecase = new ListarLivrosIndisponiveisUsecase();

      const resultado = await usecase.execute();

      if (!resultado.sucesso) return httpHelper.badRequestError(res, resultado);

      return httpHelper.success(res, resultado);
    } catch (erro: any) {
      return httpHelper.badRequestError(
        res,
        Resultado.erro(500, erro.toString())
      );
    }
  }

  static async listarLivrosDisponiveis(req: Request, res: Response) {
    try {
      const usecase = new ListarLivrosDisponiveisUsecase();

      const resultado = await usecase.execute();

      if (!resultado.sucesso) return httpHelper.badRequestError(res, resultado);

      return httpHelper.success(res, resultado);
    } catch (erro: any) {
      return httpHelper.badRequestError(
        res,
        Resultado.erro(500, erro.toString())
      );
    }
  }
}
