import { randomUUID } from "crypto";
import { DatabaseConnection } from "../../../../main/database/typeorm.connection";
import {
  Autor,
  Cidade,
  Editora,
  Emprestimo,
  Genero,
  Livro,
  Pessoa,
} from "../../../models";
import {
  AutorEntity,
  CidadeEntity,
  EditoraEntity,
  EmprestimoEntity,
  GeneroEntity,
  LivroEntity,
  PessoaEntity,
} from "../../../shared/entities";
import { CadastrarEmprestimoDto } from "../dto";
import { IsNull } from "typeorm";

export class EmprestimosRepository {
  private _manager = DatabaseConnection.connection.manager;

  async buscarEmprestimoPorId(id: string): Promise<Emprestimo | null> {
    const existe = await this._manager.findOne(EmprestimoEntity, {
      where: { id: id },
      relations: [
        "pessoa",
        "pessoa.cidade",
        "livro",
        "livro.editora",
        "livro.editora.cidade",
        "livro.autor",
        "livro.genero",
      ],
    });

    if (existe) return this.entityToModel(existe);

    return null;
  }

  async cadastrarEmprestimo(
    emprestimo: CadastrarEmprestimoDto
  ): Promise<Emprestimo> {
    const pessoa = await this._manager.findOne(PessoaEntity, {
      where: { nome: emprestimo.pessoa },
      relations: ["cidade"],
    });

    if (!pessoa) {
      throw new Error("Pessoa não encontrada.");
    }

    const livro = await this._manager.findOne(LivroEntity, {
      where: { nome: emprestimo.livro },
      relations: ["editora", "editora.cidade", "autor", "genero"],
    });

    if (!livro) {
      throw new Error("Livro não encontrado.");
    }

    if (!livro.disponivel) {
      throw new Error("O livro não está disponível para empréstimo.");
    }

    const emprestimoModel = new Emprestimo(
      randomUUID(),
      this.pessoaEntityToModel(pessoa),
      this.livroEntityToModel(livro),
      new Date(emprestimo.dataEmprestimo || Date.now())
    );

    const cadastrarEmprestimo = this._manager.create(EmprestimoEntity, {
      id: emprestimoModel.getId(),
      pessoa: pessoa,
      livro: livro,
      dataEmprestimo: emprestimoModel.getDataEmprestimo(),
      dataPrevistaDevolucao: emprestimoModel.getDataPrevistaDevolucao(),
    });
    const emprestimoSalvo = await this._manager.save(cadastrarEmprestimo);

    await this._manager.update(LivroEntity, livro.id, { disponivel: false });

    return this.entityToModel(emprestimoSalvo);
  }

  async listarEmprestimos(filtro?: string): Promise<Emprestimo[]> {
    const listaEmprestimos = await this._manager.find(EmprestimoEntity, {
      relations: [
        "pessoa",
        "pessoa.cidade",
        "livro",
        "livro.editora",
        "livro.editora.cidade",
        "livro.autor",
        "livro.genero",
      ],
    });

    const listaFiltrada = filtro
      ? listaEmprestimos.filter((e) =>
          e.pessoa.nome.toLowerCase().includes(filtro.toLowerCase())
        )
      : listaEmprestimos;

    return listaFiltrada.map((emprestimo) => this.entityToModel(emprestimo));
  }

  async devolverEmprestimo(emprestimo: Emprestimo): Promise<Emprestimo | null> {
    await this._manager.update(
      EmprestimoEntity,
      { id: emprestimo.getId() },
      { dataEfetivaDevolucao: emprestimo.getDataEfetivaDevolucao() }
    );

    await this._manager.update(
      LivroEntity,
      { id: emprestimo.getLivro().getId() },
      { disponivel: true }
    );

    return emprestimo;
  }

  async listarEmprestimosEmAtraso(): Promise<
    {
      codigoLivro: string;
      nomeLivro: string;
      nomeEditora: string;
      nomeAutor: string;
      nomePessoa: string;
      dataPrevistaDevolucao: Date;
      diasAtraso: number;
    }[]
  > {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const emprestimos = await this._manager.find(EmprestimoEntity, {
      where: {
        dataEfetivaDevolucao: IsNull(),
      },
      relations: [
        "pessoa",
        "pessoa.cidade",
        "livro",
        "livro.editora",
        "livro.editora.cidade",
        "livro.autor",
        "livro.genero",
      ],
    });

    const emprestimosAtrasados = emprestimos.filter(
      (e) => new Date(e.dataPrevistaDevolucao) < hoje
    );

    const resultado = emprestimosAtrasados.map((emprestimo) => {
      const dataPrevista = new Date(emprestimo.dataPrevistaDevolucao);
      const diasAtraso = Math.floor(
        (hoje.getTime() - dataPrevista.getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        codigoLivro: emprestimo.livro.id,
        nomeLivro: emprestimo.livro.nome,
        nomeEditora: emprestimo.livro.editora.nome,
        nomeAutor: emprestimo.livro.autor.nome,
        nomePessoa: emprestimo.pessoa.nome,
        dataPrevistaDevolucao: dataPrevista,
        diasAtraso,
      };
    });

    return resultado;
  }

  async clear() {
    await this._manager.delete(EmprestimoEntity, {});
  }

  private entityToModel(dadosDB: EmprestimoEntity): Emprestimo {
    return new Emprestimo(
      dadosDB.id,
      this.pessoaEntityToModel(dadosDB.pessoa),
      this.livroEntityToModel(dadosDB.livro),
      dadosDB.dataEmprestimo,
      dadosDB.dataEfetivaDevolucao
    );
  }

  private pessoaEntityToModel(dadosDB: PessoaEntity): Pessoa {
    return new Pessoa(
      dadosDB.id,
      dadosDB.nome,
      dadosDB.cpf,
      dadosDB.endereco,
      this.cidadeEntityToModel(dadosDB.cidade)
    );
  }

  private livroEntityToModel(dadosDB: LivroEntity): Livro {
    return new Livro(
      dadosDB.id,
      dadosDB.nome,
      this.editoraEntityToModel(dadosDB.editora),
      this.autorEntityToModel(dadosDB.autor),
      this.generoEntityToModel(dadosDB.genero),
      dadosDB.disponivel
    );
  }

  private editoraEntityToModel(dadosDB: EditoraEntity): Editora {
    return new Editora(
      dadosDB.id,
      dadosDB.nome,
      this.cidadeEntityToModel(dadosDB.cidade)
    );
  }

  private autorEntityToModel(dadosDB: AutorEntity): Autor {
    return new Autor(dadosDB.id, dadosDB.nome);
  }

  private generoEntityToModel(dadosDB: GeneroEntity): Genero {
    return new Genero(dadosDB.id, dadosDB.descricao);
  }

  private cidadeEntityToModel(dadosDB: CidadeEntity): Cidade {
    return new Cidade(dadosDB.id, dadosDB.descricao, dadosDB.uf);
  }
}
