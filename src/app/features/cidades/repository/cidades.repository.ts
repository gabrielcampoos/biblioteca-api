import { ILike } from "typeorm";
import { DatabaseConnection } from "../../../../main/database/typeorm.connection";
import { Cidade } from "../../../models";
import { CidadeEntity } from "../../../shared/entities";
import { CadastrarCidadeDto } from "../dto";

export class CidadesRepository {
  private _manager = DatabaseConnection.connection.manager;

  async verificarSeCidadeExiste(cidade: string): Promise<Cidade | null> {
    const existe = await this._manager.findOne(CidadeEntity, {
      where: { descricao: cidade },
    });

    if (existe) return this.entityToModel(existe);

    return null;
  }

  async cadastrar(cidade: CadastrarCidadeDto): Promise<Cidade> {
    const cadastrarCidade = this._manager.create(CidadeEntity, { ...cidade });

    const cidadeCadastrada = await this._manager.save(cadastrarCidade);

    return this.entityToModel(cidadeCadastrada);
  }

  async listarCidades(filtro?: string): Promise<Cidade[]> {
    const condicoes = filtro ? { descricao: ILike(`%${filtro}%`) } : {};

    const listaCidades = await this._manager.find(CidadeEntity, {
      where: condicoes,
      order: { descricao: "ASC" },
    });

    return listaCidades.map((cidade) => this.entityToModel(cidade));
  }

  async clear() {
    await this._manager.delete(CidadeEntity, {});
  }

  private entityToModel(dadosDB: CidadeEntity): Cidade {
    return new Cidade(dadosDB.id, dadosDB.descricao, dadosDB.uf);
  }
}
