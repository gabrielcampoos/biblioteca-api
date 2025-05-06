import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateTableEmprestimos1745975585276 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "emprestimos",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isNullable: false,
          },
          {
            name: "pessoa_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "livro_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "data_emprestimo",
            type: "date",
            isNullable: false,
          },
          {
            name: "data_prevista_devolucao",
            type: "date",
            isNullable: false,
          },
          {
            name: "data_efetiva_devolucao",
            type: "date",
            isNullable: true,
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ["pessoa_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "pessoas",
            name: "fk_emprestimo_pessoa",
            onDelete: "CASCADE",
          }),
          new TableForeignKey({
            columnNames: ["livro_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "livros",
            name: "fk_emprestimo_livro",
            onDelete: "CASCADE",
          }),
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("emprestimos", true, true, true);
  }
}
