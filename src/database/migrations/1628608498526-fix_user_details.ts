import {MigrationInterface, QueryRunner} from "typeorm";

export class fixUserDetails1628608498526 implements MigrationInterface {
    name = 'fixUserDetails1628608498526'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "detail_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD CONSTRAINT "UQ_673613c95633d9058a44041794d" UNIQUE ("detail_id")`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD CONSTRAINT "FK_673613c95633d9058a44041794d" FOREIGN KEY ("detail_id") REFERENCES "user_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."user" DROP CONSTRAINT "FK_673613c95633d9058a44041794d"`);
        await queryRunner.query(`ALTER TABLE "public"."user" DROP CONSTRAINT "UQ_673613c95633d9058a44041794d"`);
        await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "detail_id"`);
    }

}
