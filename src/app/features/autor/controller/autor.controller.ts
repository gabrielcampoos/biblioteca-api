import { Request, Response } from "express";
import { httpHelper } from "../../../shared/utils";
import { Resultado } from "../../../shared/utils/resultado.helper";
import { CadastrarAutorDto } from "../dto";
import { CadastrarAutorUsecase, ListarAutoresUsecase } from "../usecase";

export class AutoresController {
  static async cadastrarAutor(req: Request, res: Response) {
    const autor: CadastrarAutorDto = req.body;

    try {
      const usecase = new CadastrarAutorUsecase();

      const resultado = await usecase.execute(autor);

      if (!resultado.sucesso) return httpHelper.badRequestError(res, resultado);

      return httpHelper.success(res, resultado);
    } catch (erro: any) {
      return httpHelper.badRequestError(
        res,
        Resultado.erro(500, erro.toString())
      );
    }
  }

  static async listarAutores(req: Request, res: Response) {
    const { filtro } = req.query;

    try {
      const usecase = new ListarAutoresUsecase();

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
}
