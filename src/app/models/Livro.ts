import { Autor, AutorJson } from "./Autor";
import { Base } from "./Base";
import { Editora, EditoraJson } from "./Editora";
import { Genero, GeneroJson } from "./Genero";

export interface LivroJson {
  id: string;
  nome: string;
  editora: EditoraJson;
  autor: AutorJson;
  genero: GeneroJson;
  disponivel: boolean;
}

export class Livro extends Base {
  constructor(
    _id: string,
    private _nome: string,
    private _editora: Editora,
    private _autor: Autor,
    private _genero: Genero,
    private _disponivel: boolean
  ) {
    super(_id);
  }

  toJson(): LivroJson {
    return {
      id: this._id,
      nome: this._nome,
      editora: this._editora.toJson(),
      autor: this._autor.toJson(),
      genero: this._genero.toJson(),
      disponivel: this._disponivel,
    };
  }

  getId(): string {
    return this._id;
  }

  getNome(): string {
    return this._nome;
  }

  getEditora(): Editora {
    return this._editora;
  }

  getAutor(): Autor {
    return this._autor;
  }

  getGenero(): Genero {
    return this._genero;
  }

  getDisponivel(): boolean {
    return this._disponivel;
  }

  setId(id: string): void {
    this._id = id;
  }

  setNome(nome: string): void {
    this._nome = nome;
  }

  setEditora(editora: Editora): void {
    this._editora = editora;
  }

  setAutor(autor: Autor): void {
    this._autor = autor;
  }

  setGenero(genero: Genero): void {
    this._genero = genero;
  }

  setDisponivel(disponivel: boolean): void {
    this._disponivel = disponivel;
  }
}
