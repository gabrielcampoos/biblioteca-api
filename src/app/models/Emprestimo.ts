import { Base } from "./Base";
import { Livro, LivroJson } from "./Livro";
import { Pessoa, PessoaJson } from "./Pessoa";

export interface EmprestimoJson {
  id: string;
  pessoa: PessoaJson;
  livro: LivroJson;
  dataEmprestimo: Date;
  dataPrevistaDevolucao: Date;
  dataEfetivaDevolucao?: Date;
}

export class Emprestimo extends Base {
  private _dataEmprestimo: Date;
  private _dataPrevistaDevolucao: Date;
  private _dataEfetivaDevolucao?: Date;
  constructor(
    _id: string,
    private _pessoa: Pessoa,
    private _livro: Livro,
    _dataEmprestimo?: Date | string,
    _dataEfetivaDevolucao?: Date | string
  ) {
    super(_id);

    this._dataEmprestimo = _dataEmprestimo
      ? new Date(_dataEmprestimo)
      : new Date();

    this._dataPrevistaDevolucao = new Date(
      this._dataEmprestimo.getTime() + 7 * 24 * 60 * 60 * 1000
    );

    this._dataEfetivaDevolucao = _dataEfetivaDevolucao
      ? new Date(_dataEfetivaDevolucao)
      : undefined;
  }

  toJson(): EmprestimoJson {
    return {
      id: this._id,
      pessoa: this._pessoa.toJson(),
      livro: this._livro.toJson(),
      dataEmprestimo: this._dataEmprestimo,
      dataPrevistaDevolucao: this._dataPrevistaDevolucao,
      dataEfetivaDevolucao: this._dataEfetivaDevolucao,
    };
  }

  getId(): string {
    return this._id;
  }

  getPessoa(): Pessoa {
    return this._pessoa;
  }

  getLivro(): Livro {
    return this._livro;
  }

  getDataEmprestimo(): Date {
    return this._dataEmprestimo;
  }

  getDataPrevistaDevolucao(): Date {
    return this._dataPrevistaDevolucao;
  }

  getDataEfetivaDevolucao(): Date | undefined {
    return this._dataEfetivaDevolucao;
  }

  setId(id: string): void {
    this._id = id;
  }

  setPessoa(pessoa: Pessoa): void {
    this._pessoa = pessoa;
  }

  setLivro(livro: Livro): void {
    this._livro = livro;
  }

  setDataEmprestimo(dataEmprestimo: Date): void {
    this._dataEmprestimo = dataEmprestimo;
  }

  setDataEfetivaDevolucao(dataEfetivaDevolucao: Date): void {
    this._dataEfetivaDevolucao = dataEfetivaDevolucao;
  }
}
