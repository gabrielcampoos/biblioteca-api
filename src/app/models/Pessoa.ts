import { Base } from "./Base";
import { Cidade, CidadeJson } from "./Cidade";

export interface PessoaJson {
  id: string;
  nome: string;
  cpf: string;
  endereco: string;
  cidade: CidadeJson;
}

export class Pessoa extends Base {
  constructor(
    _id: string,
    private _nome: string,
    private _cpf: string,
    private _endereco: string,
    private _cidade: Cidade
  ) {
    super(_id);
  }

  toJson(): PessoaJson {
    return {
      id: this._id,
      nome: this._nome,
      cpf: this._cpf,
      endereco: this._endereco,
      cidade: this._cidade.toJson(),
    };
  }

  getId(): string {
    return this._id;
  }

  getNome(): string {
    return this._nome;
  }

  getCpf(): string {
    return this._cpf;
  }

  getEndereco(): string {
    return this._endereco;
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

  setCpf(cpf: string): void {
    this._cpf = cpf;
  }

  setEndereco(endereco: string): void {
    this._endereco = endereco;
  }

  setCidade(cidade: Cidade): void {
    this._cidade = cidade;
  }
}
