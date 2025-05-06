import { Request, Response } from "express";
import { httpHelper } from "../../../shared/utils";
import { Resultado } from "../../../shared/utils/resultado.helper";
import { CadastrarGeneroDto } from "../dto";
import { CadastrarGeneroUsecase, ListarGenerosUsecase } from "../usecase";

export class GenerosController {
  static async cadastrarGenero(req: Request, res: Response) {
    const genero: CadastrarGeneroDto = req.body;

    try {
      const usecase = new CadastrarGeneroUsecase();

      const resultado = await usecase.execute(genero);

      if (!resultado.sucesso) return httpHelper.badRequestError(res, resultado);

      return httpHelper.success(res, resultado);
    } catch (erro: any) {
      return httpHelper.badRequestError(
        res,
        Resultado.erro(500, erro.toString())
      );
    }
  }

  static async listarGeneros(req: Request, res: Response) {
    const { filtro } = req.query;

    try {
      const usecase = new ListarGenerosUsecase();

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
