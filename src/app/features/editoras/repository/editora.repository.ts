import { ILike } from "typeorm";
import { DatabaseConnection } from "../../../../main/database/typeorm.connection";
import { Autor, Cidade, Editora } from "../../../models";
import {
  AutorEntity,
  CidadeEntity,
  EditoraEntity,
} from "../../../shared/entities";
import { CadastrarEditoraDto } from "../dto";

export class EditoraRepository {
  private _manager = DatabaseConnection.connection.manager;

  async verificarSeEditoraExiste(nome: string): Promise<Editora | null> {
    const existe = await this._manager.findOne(EditoraEntity, {
      where: { nome },
      relations: ["cidade"],
    });

    if (existe) return this.entityToModel(existe);

    return null;
  }

  async cadastrar(editora: CadastrarEditoraDto): Promise<Editora> {
    const cidade = await this._manager.findOne(CidadeEntity, {
      where: { descricao: editora.cidade },
    });

    if (!cidade) {
      throw new Error("Cidade não encontrada.");
    }

    const novaEditora = this._manager.create(EditoraEntity, {
      nome: editora.nome,
      cidade: cidade,
    });

    const editoraSalva = await this._manager.save(novaEditora);

    return this.entityToModel(editoraSalva);
  }

  async listarEditoras(filtro?: string): Promise<Editora[]> {
    const condicoes = filtro ? { nome: ILike(`%${filtro}%`) } : {};

    const listaEditoras = await this._manager.find(EditoraEntity, {
      where: condicoes,
      order: { nome: "ASC" },
      relations: ["cidade"],
    });

    return listaEditoras.map((editora) => this.entityToModel(editora));
  }

  async clear() {
    await this._manager.delete(EditoraEntity, {});
  }

  private entityToModel(dadosDB: EditoraEntity): Editora {
    return new Editora(
      dadosDB.id,
      dadosDB.nome,
      this.cidadeEntityToModel(dadosDB.cidade)
    );
  }

  private cidadeEntityToModel(dadosDB: CidadeEntity): Cidade {
    return new Cidade(dadosDB.id, dadosDB.descricao, dadosDB.uf);
  }
}
