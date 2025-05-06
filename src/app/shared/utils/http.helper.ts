import { Response } from "express";
import { ResultadoDTO } from "./resultado.helper";

class HttpHelper {
  public success(res: Response, resultado: ResultadoDTO) {
    return res.status(resultado.codigo ?? 200).send(resultado);
  }

  public serverError(res: Response, resultado: ResultadoDTO) {
    return res.status(resultado.codigo ?? 500).send(resultado);
  }

  public badRequestError(res: Response, resultado: ResultadoDTO) {
    return res.status(resultado.codigo ?? 400).send(resultado);
  }
}

export const httpHelper = new HttpHelper();
