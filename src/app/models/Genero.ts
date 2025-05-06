import { Base } from "./Base";

export interface GeneroJson {
  id: string;
  descricao: string;
}

export class Genero extends Base {
  constructor(_id: string, private _descricao: string) {
    super(_id);
  }

  toJson(): GeneroJson {
    return {
      id: this._id,
      descricao: this._descricao,
    };
  }

  getId(): string {
    return this._id;
  }

  getDescricao(): string {
    return this._descricao;
  }

  setId(id: string): void {
    this._id = id;
  }

  setDescricao(descricao: string): void {
    this._descricao = descricao;
  }
}
