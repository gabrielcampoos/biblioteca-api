import { NextFunction, Request, Response } from "express";
import { httpHelper } from "../../../shared/utils";
import { Resultado } from "../../../shared/utils/resultado.helper";
import { validarCPF } from "../../../shared/utils/validar-cpf.helper";

export const validarCamposPessoa = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { nome, cpf, endereco, cidade } = req.body;

  if (!nome || typeof nome !== "string") {
    return httpHelper.badRequestError(
      res,
      Resultado.erro(400, "Nome é obrigatório e deve ser uma string.")
    );
  }

  if (!cpf || typeof cpf !== "string" || !validarCPF(cpf)) {
    return httpHelper.badRequestError(
      res,
      Resultado.erro(400, "CPF inválido.")
    );
  }

  if (!endereco || typeof endereco !== "string") {
    return httpHelper.badRequestError(
      res,
      Resultado.erro(400, "Endereço é obrigatório e deve ser uma string.")
    );
  }

  if (!cidade || typeof cidade !== "string") {
    return httpHelper.badRequestError(
      res,
      Resultado.erro(400, "Cidade é obrigatória e deve ser uma string.")
    );
  }

  return next();
};
