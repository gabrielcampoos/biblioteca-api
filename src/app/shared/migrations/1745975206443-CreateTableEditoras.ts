import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateTableEditoras1745975206443 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "editoras",
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
          },
          {
            name: "cidade_id",
            type: "uuid",
            isNullable: true,
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ["cidade_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "cidades",
            name: "fk_editora_cidade",
            onDelete: "SET NULL",
          }),
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("editoras", true, true, true);
  }
}
