import { Base } from "./Base";
import { Cidade, CidadeJson } from "./Cidade";

export interface EditoraJson {
  id: string;
  nome: string;
  cidade: CidadeJson;
}

export class Editora extends Base {
  constructor(_id: string, private _nome: string, private _cidade: Cidade) {
    super(_id);
  }

  toJson(): EditoraJson {
    return {
      id: this._id,
      nome: this._nome,
      cidade: this._cidade.toJson(),
    };
  }

  getId(): string {
    return this._id;
  }

  getNome(): string {
    return this._nome;
  }

  getCidade(): Cidade {
    return this._cidade;
  }

  setId(id: string): void {
    this._id = id;
  }

  setNome(nome: string): void {
    this._nome = nome;
  }

  setCidade(cidade: Cidade): void {
    this._cidade = cidade;
  }
}
