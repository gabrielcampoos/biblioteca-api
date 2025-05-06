import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity({ name: "generos" })
export class GeneroEntity extends BaseEntity {
  @Column()
  descricao!: string;
}
