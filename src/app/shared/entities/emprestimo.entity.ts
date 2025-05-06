import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { LivroEntity } from "./livro.entity";
import { PessoaEntity } from "./pessoa.entity";
import { BaseEntity } from "./base.entity";

@Entity({ name: "emprestimos" })
export class EmprestimoEntity extends BaseEntity {
  @ManyToOne(() => PessoaEntity)
  @JoinColumn({ name: "pessoa_id" })
  pessoa!: PessoaEntity;

  @ManyToOne(() => LivroEntity)
  @JoinColumn({ name: "livro_id" })
  livro!: LivroEntity;

  @Column({ name: "data_emprestimo", type: "date" })
  dataEmprestimo!: Date;

  @Column({ name: "data_prevista_devolucao", type: "date" })
  dataPrevistaDevolucao!: Date;

  @Column({ name: "data_efetiva_devolucao", type: "date", nullable: true })
  dataEfetivaDevolucao?: Date;
}
