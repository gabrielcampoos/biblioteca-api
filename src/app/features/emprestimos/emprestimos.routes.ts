import { Router } from "express";
import { EmprestimosController } from "./controller";

export default () => {
  const router = Router();

  router.post("/emprestimos", EmprestimosController.cadastrarEmprestimo);

  router.get("/emprestimos", EmprestimosController.listarEmprestimos);
  router.get(
    "/emprestimos/atrasados",
    EmprestimosController.listarEmprestimosAtrasados
  );

  router.patch("/emprestimos/:id", EmprestimosController.devolverEmprestimo);

  return router;
};
