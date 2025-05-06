import { Router } from "express";
import { CidadesController } from "./controller";

export default () => {
  const router = Router();

  router.post("/cidades", CidadesController.cadastrarCidade);

  router.get("/cidades", CidadesController.listarCidades);

  return router;
};
