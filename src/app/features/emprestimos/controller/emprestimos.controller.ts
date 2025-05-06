import { Request, Response } from "express";
import { httpHelper } from "../../../shared/utils";
import { Resultado } from "../../../shared/utils/resultado.helper";
import { CadastrarEmprestimoDto } from "../dto";
import {
  CadastrarEmprestimosUsecase,
  DevolverEmprestimoUsecase,
  ListarEmprestimosAtrasadosUsecase,
  ListarEmprestimosUsecase,
} from "../usecase";

export class EmprestimosController {
  static async cadastrarEmprestimo(req: Request, res: Response) {
    const emprestimo: CadastrarEmprestimoDto = req.body;

    try {
      const usecase = new CadastrarEmprestimosUsecase();

      const resultado = await usecase.execute(emprestimo);

      if (!resultado.sucesso) return httpHelper.badRequestError(res, resultado);

      return httpHelper.success(res, resultado);
    } catch (erro: any) {
      return httpHelper.badRequestError(
        res,
        Resultado.erro(500, erro.toString())
      );
    }
  }

  static async listarEmprestimos(req: Request, res: Response) {
    const { filtro } = req.query;

    try {
      const usecase = new ListarEmprestimosUsecase();

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

  static async devolverEmprestimo(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const usecase = new DevolverEmprestimoUsecase();
      const resultado = await usecase.execute(id);

      if (!resultado.sucesso) return httpHelper.badRequestError(res, resultado);
      return httpHelper.success(res, resultado);
    } catch (erro: any) {
      return httpHelper.badRequestError(
        res,
        Resultado.erro(500, erro.toString())
      );
    }
  }

  static async listarEmprestimosAtrasados(req: Request, res: Response) {
    try {
      const usecase = new ListarEmprestimosAtrasadosUsecase();
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
