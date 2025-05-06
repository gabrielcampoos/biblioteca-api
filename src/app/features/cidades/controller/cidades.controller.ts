import { Request, Response } from "express";
import { httpHelper } from "../../../shared/utils";
import { Resultado } from "../../../shared/utils/resultado.helper";
import { CadastrarCidadeDto } from "../dto";
import { CadastrarCidadeUsecase, ListarCidadesUsecase } from "../usecase";

export class CidadesController {
  static async cadastrarCidade(req: Request, res: Response) {
    const cidade: CadastrarCidadeDto = req.body;

    try {
      const usecase = new CadastrarCidadeUsecase();

      const resultado = await usecase.execute(cidade);

      if (!resultado.sucesso) return httpHelper.badRequestError(res, resultado);

      return httpHelper.success(res, resultado);
    } catch (erro: any) {
      return httpHelper.badRequestError(
        res,
        Resultado.erro(500, erro.toString())
      );
    }
  }

  static async listarCidades(req: Request, res: Response) {
    const { filtro } = req.query;

    try {
      const usecase = new ListarCidadesUsecase();

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
