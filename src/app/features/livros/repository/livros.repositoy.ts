import { ILike } from "typeorm";
import { DatabaseConnection } from "../../../../main/database/typeorm.connection";
import { Autor, Cidade, Editora, Genero, Livro } from "../../../models";
import {
  AutorEntity,
  CidadeEntity,
  EditoraEntity,
  GeneroEntity,
  LivroEntity,
} from "../../../shared/entities";
import { CadastrarLivroDto } from "../dto";

export class LivrosRepository {
  private _manager = DatabaseConnection.connection.manager;

  async verificarSeLivroExiste(nome: string): Promise<Livro | null> {
    const existe = await this._manager.findOne(LivroEntity, {
      where: { nome },
      relations: ["editora", "editora.cidade", "autor", "genero"],
    });

    if (existe) return this.entityToModel(existe);

    return null;
  }

  async cadastrar(livro: CadastrarLivroDto): Promise<Livro> {
    const editora = await this._manager.findOne(EditoraEntity, {
      where: { nome: livro.editora },
      relations: ["cidade"],
    });

    if (!editora) {
      throw new Error("Editora não encontrada.");
    }

    const autor = await this._manager.findOne(AutorEntity, {
      where: { nome: livro.autor },
    });

    if (!autor) {
      throw new Error("Autor não encontrado.");
    }

    const genero = await this._manager.findOne(GeneroEntity, {
      where: { descricao: livro.genero },
    });

    if (!genero) {
      throw new Error("Genero não encontrado.");
    }

    const cadastrarLivro = this._manager.create(LivroEntity, {
      nome: livro.nome,
      editora: editora,
      autor: autor,
      genero: genero,
      disponivel: true,
    });

    const livroSalvo = await this._manager.save(cadastrarLivro);

    return this.entityToModel(livroSalvo);
  }

  async listarLivros(filtro?: string): Promise<Livro[]> {
    const condicoes = filtro ? { nome: ILike(`%${filtro}%`) } : {};

    const listaLivros = await this._manager.find(LivroEntity, {
      where: condicoes,
      order: { nome: "ASC" },
      relations: ["editora", "editora.cidade", "autor", "genero"],
    });

    return listaLivros.map((livro) => this.entityToModel(livro));
  }

  async listarLivrosIndisponiveis(): Promise<Livro[]> {
    const livrosIndisponiveis = await this._manager.find(LivroEntity, {
      where: { disponivel: false },
      order: { nome: "ASC" },
      relations: ["editora", "editora.cidade", "autor", "genero"],
    });

    return livrosIndisponiveis.map((livro) => this.entityToModel(livro));
  }

  async listarLivrosDisponiveis(): Promise<Livro[]> {
    const livrosDisponiveis = await this._manager.find(LivroEntity, {
      where: { disponivel: true },
      order: { nome: "ASC" },
      relations: ["editora", "editora.cidade", "autor", "genero"],
    });

    return livrosDisponiveis.map((livro) => this.entityToModel(livro));
  }

  private entityToModel(dadosDB: LivroEntity): Livro {
    return new Livro(
      dadosDB.id,
      dadosDB.nome,
      this.editoraEntityToModel(dadosDB.editora),
      this.autorEntityToModel(dadosDB.autor),
      this.generoEntityToModel(dadosDB.genero),
      dadosDB.disponivel
    );
  }

  private editoraEntityToModel(dadosDB: EditoraEntity): Editora {
    return new Editora(
      dadosDB.id,
      dadosDB.nome,
      this.cidadeEntityToModel(dadosDB.cidade)
    );
  }

  private autorEntityToModel(dadosDB: AutorEntity): Autor {
    return new Autor(dadosDB.id, dadosDB.nome);
  }

  private generoEntityToModel(dadosDB: GeneroEntity): Genero {
    return new Genero(dadosDB.id, dadosDB.descricao);
  }

  private cidadeEntityToModel(dadosDB: CidadeEntity): Cidade {
    return new Cidade(dadosDB.id, dadosDB.descricao, dadosDB.uf);
  }
}
