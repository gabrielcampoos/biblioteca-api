import { ILike } from "typeorm";
import { DatabaseConnection } from "../../../../main/database/typeorm.connection";
import { Autor } from "../../../models";
import { AutorEntity } from "../../../shared/entities";
import { CadastrarAutorDto } from "../dto";

export class AutorRepository {
  private _manager = DatabaseConnection.connection.manager;

  async verificarSeAutorExiste(nome: string): Promise<Autor | null> {
    const existe = await this._manager.findOne(AutorEntity, {
      where: { nome },
    });

    if (existe) return this.entityToModel(existe);

    return null;
  }

  async cadastrar(autor: CadastrarAutorDto): Promise<Autor> {
    const novoAutor = this._manager.create(AutorEntity, {
      ...autor,
    });

    const autorSalvo = await this._manager.save(novoAutor);

    return this.entityToModel(autorSalvo);
  }

  async listarAutores(filtro?: string): Promise<Autor[]> {
    const condicoes = filtro ? { nome: ILike(`%${filtro}%`) } : {};

    const listaAutores = await this._manager.find(AutorEntity, {
      where: condicoes,
      order: { nome: "ASC" },
    });

    return listaAutores.map((autor) => this.entityToModel(autor));
  }

  async clear() {
    await this._manager.delete(AutorEntity, {});
  }

  private entityToModel(dadosDB: AutorEntity): Autor {
    return new Autor(dadosDB.id, dadosDB.nome);
  }
}
