import { Router } from "express";
import { GenerosController } from "./controller";

export default () => {
  const router = Router();

  router.post("/generos", GenerosController.cadastrarGenero);

  router.get("/generos", GenerosController.listarGeneros);

  return router;
};
