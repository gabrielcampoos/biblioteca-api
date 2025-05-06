import { Router } from "express";
import { LivrosController } from "./controller";

export default () => {
  const router = Router();

  router.post("/livros", LivrosController.cadastrarLivro);

  router.get("/livros", LivrosController.listarLivros);
  router.get(
    "/livros/indisponiveis",
    LivrosController.listarLivrosIndisponiveis
  );
  router.get("/livros/disponiveis", LivrosController.listarLivrosDisponiveis);

  return router;
};
