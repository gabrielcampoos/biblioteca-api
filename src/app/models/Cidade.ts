import { Base } from "./Base";

export interface CidadeJson {
  id: string;
  descricao: string;
  uf: string;
}

export class Cidade extends Base {
  constructor(_id: string, private _descricao: string, private _uf: string) {
    super(_id);
  }

  toJson(): CidadeJson {
    return {
      id: this._id,
      descricao: this._descricao,
      uf: this._uf,
    };
  }

  getId(): string {
    return this._id;
  }

  getDescricao(): string {
    return this._descricao;
  }

  getUf(): string {
    return this._uf;
  }

  setId(id: string): void {
    this._id = id;
  }

  setDescricao(descricao: string): void {
    this._descricao = descricao;
  }

  setUf(uf: string): void {
    this._uf = uf;
  }
}
