import { Base } from "./Base";

export interface AutorJson {
  id: string;
  nome: string;
}

export class Autor extends Base {
  constructor(_id: string, private _nome: string) {
    super(_id);
  }

  toJson(): AutorJson {
    return {
      id: this._id,
      nome: this._nome,
    };
  }

  getId(): string {
    return this._id;
  }

  getNome(): string {
    return this._nome;
  }

  setId(id: string): void {
    this._id = id;
  }

  setNome(nome: string): void {
    this._nome = nome;
  }
}
