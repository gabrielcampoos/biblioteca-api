import { Request, Response } from "express";
import { httpHelper } from "../../../shared/utils";
import { Resultado } from "../../../shared/utils/resultado.helper";
import { CadastrarPessoaDto } from "../dto";
import { CadastrarPessoaUsecase, ListarPessoasUsecase } from "../usecase";

export class PessoasController {
  static async cadastrarPessoa(req: Request, res: Response) {
    const pessoa: CadastrarPessoaDto = req.body;

    try {
      const usecase = new CadastrarPessoaUsecase();

      const resultado = await usecase.execute(pessoa);

      if (!resultado.sucesso) return httpHelper.badRequestError(res, resultado);

      return httpHelper.success(res, resultado);
    } catch (erro: any) {
      return httpHelper.badRequestError(
        res,
        Resultado.erro(500, erro.toString())
      );
    }
  }

  static async listarPessoas(req: Request, res: Response) {
    const { filtro } = req.query;

    try {
      const usecase = new ListarPessoasUsecase();

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
