import { Router } from "express";
import { PessoasController } from "./controller";
import { validarCamposPessoa } from "./middleware";

export default () => {
  const router = Router();

  router.post(
    "/pessoas",
    validarCamposPessoa,
    PessoasController.cadastrarPessoa
  );

  router.get("/pessoas", PessoasController.listarPessoas);

  return router;
};
