import { MigrationInterface, QueryRunner } from "typeorm";

export class BookingTableTimestampColumns1720292921505 implements MigrationInterface {
    name = 'BookingTableTimestampColumns1720292921505'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "booking" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "review" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "review" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "review" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "review" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "createdAt"`);
    }

}
