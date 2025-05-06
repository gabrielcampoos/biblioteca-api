import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity({ name: "cidades" })
export class CidadeEntity extends BaseEntity {
  @Column()
  descricao!: string;

  @Column()
  uf!: string;
}
