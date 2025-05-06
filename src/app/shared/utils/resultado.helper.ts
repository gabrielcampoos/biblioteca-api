export interface ResultadoDTO {
  codigo: number;
  mensagem: string;
  sucesso: boolean;
  dados?: any;
}

export class Resultado {
  private _codigo!: number;
  private _mensagem!: string;
  private _sucesso!: boolean;
  private _dados?: any;

  private constructor() {}

  private adicionarDados(dados?: any): void {
    this._dados = dados;
  }

  private adicionarErro(codigo: number, mensagem: string): void {
    this._codigo = codigo;
    this._mensagem = mensagem;
    this._sucesso = false;
  }

  private toJSON(): ResultadoDTO {
    return {
      mensagem: this._mensagem,
      codigo: this._codigo,
      sucesso: this._sucesso,
      dados: this._dados,
    };
  }

  public static erro(codigo: number, mensagem: string): ResultadoDTO {
    const resultado = new Resultado();

    resultado.adicionarErro(codigo, mensagem);

    return resultado.toJSON();
  }

  public static sucesso(
    codigo: number,
    mensagem: string,
    dados: any
  ): ResultadoDTO {
    const resultado = new Resultado();

    resultado.adicionarDados(dados);

    resultado._codigo = codigo;

    resultado._mensagem = mensagem;

    resultado._sucesso = true;

    return resultado.toJSON();
  }
}
