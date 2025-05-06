import { Request, Response } from "express";
import { httpHelper } from "../../../shared/utils";
import { Resultado } from "../../../shared/utils/resultado.helper";
import { CadastrarEditoraDto } from "../dto";
import { CadastrarEditoraUsecase, ListarEditorasUsecase } from "../usecase";

export class EditorasController {
  static async cadastrarEditora(req: Request, res: Response) {
    const editora: CadastrarEditoraDto = req.body;

    try {
      const usecase = new CadastrarEditoraUsecase();

      const resultado = await usecase.execute(editora);

      if (!resultado.sucesso) return httpHelper.badRequestError(res, resultado);

      return httpHelper.success(res, resultado);
    } catch (erro: any) {
      return httpHelper.badRequestError(
        res,
        Resultado.erro(500, erro.toString())
      );
    }
  }

  static async listarEditoras(req: Request, res: Response) {
    const { filtro } = req.query;

    try {
      const usecase = new ListarEditorasUsecase();

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
