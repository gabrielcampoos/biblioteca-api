import { ILike } from "typeorm";
import { DatabaseConnection } from "../../../../main/database/typeorm.connection";
import { Genero } from "../../../models";
import { GeneroEntity } from "../../../shared/entities";
import { CadastrarGeneroDto } from "../dto";

export class GenerosRepository {
  private _manager = DatabaseConnection.connection.manager;

  async verificarSeGeneroExiste(descricao: string): Promise<Genero | null> {
    const existe = await this._manager.findOne(GeneroEntity, {
      where: { descricao },
    });

    if (existe) return this.entityToModel(existe);

    return null;
  }

  async cadastrar(genero: CadastrarGeneroDto): Promise<Genero> {
    const novoGenero = this._manager.create(GeneroEntity, {
      ...genero,
    });

    const generoSalvo = await this._manager.save(novoGenero);

    return this.entityToModel(generoSalvo);
  }

  async listarGeneros(filtro?: string): Promise<Genero[]> {
    const condicoes = filtro ? { descricao: ILike(`%${filtro}%`) } : {};

    const listaGeneros = await this._manager.find(GeneroEntity, {
      where: condicoes,
      order: { descricao: "ASC" },
    });

    return listaGeneros.map((genero) => this.entityToModel(genero));
  }

  async clear() {
    await this._manager.delete(GeneroEntity, {});
  }

  private entityToModel(dadosDB: GeneroEntity): Genero {
    return new Genero(dadosDB.id, dadosDB.descricao);
  }
}
