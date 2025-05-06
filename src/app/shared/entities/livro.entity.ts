import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AutorEntity } from "./autor.entity";
import { EditoraEntity } from "./editora.entity";
import { GeneroEntity } from "./genero.entity";
import { BaseEntity } from "./base.entity";

@Entity({ name: "livros" })
export class LivroEntity extends BaseEntity {
  @Column()
  nome!: string;

  @ManyToOne(() => EditoraEntity)
  @JoinColumn({ name: "editora_id" })
  editora!: EditoraEntity;

  @ManyToOne(() => AutorEntity)
  @JoinColumn({ name: "autor_id" })
  autor!: AutorEntity;

  @ManyToOne(() => GeneroEntity)
  @JoinColumn({ name: "genero_id" })
  genero!: GeneroEntity;

  @Column()
  disponivel!: boolean;
}
