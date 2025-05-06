import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateTableLivros1745975488402 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "livros",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isNullable: false,
          },
          {
            name: "nome",
            type: "varchar",
            length: "255",
          },
          {
            name: "editora_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "autor_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "genero_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "disponivel",
            type: "boolean",
            isNullable: false,
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ["editora_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "editoras",
            name: "fk_livro_editora",
            onDelete: "CASCADE",
          }),
          new TableForeignKey({
            columnNames: ["autor_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "autores",
            name: "fk_livro_autor",
            onDelete: "CASCADE",
          }),
          new TableForeignKey({
            columnNames: ["genero_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "generos",
            name: "fk_livro_genero",
            onDelete: "CASCADE",
          }),
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("livros", true, true, true);
  }
}
