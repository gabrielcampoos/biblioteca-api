import { Router } from "express";
import { AutoresController } from "./controller";

export default () => {
  const router = Router();

  router.post("/autores", AutoresController.cadastrarAutor);

  router.get("/autores", AutoresController.listarAutores);

  return router;
};
