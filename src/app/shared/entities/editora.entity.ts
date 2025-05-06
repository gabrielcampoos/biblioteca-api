import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { CidadeEntity } from "./cidade.entity";
import { BaseEntity } from "./base.entity";

@Entity({ name: "editoras" })
export class EditoraEntity extends BaseEntity {
  @Column()
  nome!: string;

  @ManyToOne(() => CidadeEntity)
  @JoinColumn({ name: "cidade_id" })
  cidade!: CidadeEntity;
}
