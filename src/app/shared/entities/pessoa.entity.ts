import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { CidadeEntity } from "./cidade.entity";
import { BaseEntity } from "./base.entity";

@Entity({ name: "pessoas" })
export class PessoaEntity extends BaseEntity {
  @Column()
  nome!: string;

  @Column()
  cpf!: string;

  @Column()
  endereco!: string;

  @ManyToOne(() => CidadeEntity)
  @JoinColumn({ name: "cidade_id" })
  cidade!: CidadeEntity;
}
