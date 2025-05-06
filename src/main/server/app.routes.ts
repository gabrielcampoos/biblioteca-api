import { Express } from "express";
import cidadesRoutes from "../../app/features/cidades/cidades.routes";
import pessoasRoutes from "../../app/features/pessoas/pessoas.routes";
import autorRoutes from "../../app/features/autor/autor.routes";
import editoraRoutes from "../../app/features/editoras/editora.routes";
import generoRoutes from "../../app/features/generos/genero.routes";
import livrosRoutes from "../../app/features/livros/livros.routes";
import emprestimosRoutes from "../../app/features/emprestimos/emprestimos.routes";

export const makeRoutes = (app: Express) => {
  app.use(
    cidadesRoutes(),
    pessoasRoutes(),
    autorRoutes(),
    editoraRoutes(),
    generoRoutes(),
    livrosRoutes(),
    emprestimosRoutes()
  );
};
