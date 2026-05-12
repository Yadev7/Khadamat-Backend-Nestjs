import { MigrationInterface, QueryRunner } from 'typeorm';

export class AllowNullableMemberRelations1775213007834
  implements MigrationInterface
{
  name = 'AllowNullableMemberRelations1775213007834';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "fileCategory"`);
    await queryRunner.query(`DROP TYPE "public"."file_filecategory_enum"`);
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "fileDescription"`);
    await queryRunner.query(
      `ALTER TABLE "file" ADD "fileCategory" "public"."file_filecategory_enum" NOT NULL DEFAULT 'other'`,
    );
    await queryRunner.query(
      `ALTER TABLE "file" ADD "fileDescription" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "fileDescription"`);
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "fileCategory"`);
    await queryRunner.query(
      `ALTER TABLE "file" ADD "fileDescription" character varying`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."file_filecategory_enum" AS ENUM('image', 'video', 'audio', 'document', 'archive', 'other')`,
    );
    await queryRunner.query(
      `ALTER TABLE "file" ADD "fileCategory" "public"."file_filecategory_enum" NOT NULL DEFAULT 'other'`,
    );
  }
}
