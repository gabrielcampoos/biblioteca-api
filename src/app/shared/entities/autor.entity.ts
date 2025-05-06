import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity({ name: "autores" })
export class AutorEntity extends BaseEntity {
  @Column()
  nome!: string;
}
