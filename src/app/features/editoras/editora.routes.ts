import { Router } from "express";
import { EditorasController } from "./controller";

export default () => {
  const router = Router();

  router.post("/editoras", EditorasController.cadastrarEditora);

  router.get("/editoras", EditorasController.listarEditoras);

  return router;
};
