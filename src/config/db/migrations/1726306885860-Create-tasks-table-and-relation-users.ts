import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTasksTableAndRelationUsers1726306885860 implements MigrationInterface {
  name = "CreateTasksTableAndRelationUsers1726306885860";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`tasks\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`status\` enum ('Pending', 'Completed') NOT NULL DEFAULT 'Pending', \`dueDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modificationDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tasks\` ADD CONSTRAINT \`FK_166bd96559cb38595d392f75a35\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`tasks\` DROP FOREIGN KEY \`FK_166bd96559cb38595d392f75a35\``);
    await queryRunner.query(`DROP TABLE \`tasks\``);
  }
}
