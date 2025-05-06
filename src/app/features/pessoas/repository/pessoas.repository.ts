import { ILike } from "typeorm";
import { DatabaseConnection } from "../../../../main/database/typeorm.connection";
import { Cidade, Pessoa } from "../../../models";
import { CidadeEntity, PessoaEntity } from "../../../shared/entities";
import { CadastrarPessoaDto } from "../dto";
// 65685

export class PessoasRepository {
  private _manager = DatabaseConnection.connection.manager;

  async verificarSePessoaExiste(cpf: string): Promise<Pessoa | null> {
    const existe = await this._manager.findOne(PessoaEntity, {
      where: { cpf },
      relations: ["cidade"],
    });

    if (existe) return this.entityToModel(existe);

    return null;
  }

  async cadastrar(pessoa: CadastrarPessoaDto): Promise<Pessoa> {
    const descricaoNormalizada = pessoa.cidade.trim().toLowerCase();

    const cidade = await this._manager.findOne(CidadeEntity, {
      where: {
        descricao: ILike(descricaoNormalizada),
      },
    });

    if (!cidade) {
      throw new Error("Cidade não encontrada.");
    }

    const cadastrarPessoa = this._manager.create(PessoaEntity, {
      nome: pessoa.nome,
      cpf: pessoa.cpf,
      endereco: pessoa.endereco,
      cidade: cidade,
    });

    const pessoaSalva = await this._manager.save(cadastrarPessoa);

    const pessoaComCidade = await this._manager.findOne(PessoaEntity, {
      where: { id: pessoaSalva.id },
      relations: ["cidade"],
    });

    if (!pessoaComCidade) {
      throw new Error("Erro ao buscar pessoa cadastrada.");
    }

    return this.entityToModel(pessoaComCidade);
  }

  async listarPessoas(filtro?: string): Promise<Pessoa[]> {
    const condicoes = filtro ? { nome: ILike(`%${filtro}%`) } : {};

    const listaPessoas = await this._manager.find(PessoaEntity, {
      where: condicoes,
      order: { nome: "ASC" },
      relations: ["cidade"],
    });

    return listaPessoas.map((pessoa) => this.entityToModel(pessoa));
  }

  async clear() {
    await this._manager.delete(PessoaEntity, {});
  }

  private entityToModel(dadosDB: PessoaEntity): Pessoa {
    return new Pessoa(
      dadosDB.id,
      dadosDB.nome,
      dadosDB.cpf,
      dadosDB.endereco,
      this.cidadeEntityToModel(dadosDB.cidade)
    );
  }

  private cidadeEntityToModel(dadosDB: CidadeEntity): Cidade {
    return new Cidade(dadosDB.id, dadosDB.descricao, dadosDB.uf);
  }
}
