import { MigrationInterface, QueryRunner } from "typeorm";

export class CreditcardWalletTable1720337109641 implements MigrationInterface {
    name = 'CreditcardWalletTable1720337109641'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "credit_card" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "cardNumber" character varying NOT NULL, "cardHolderName" character varying NOT NULL, "expiryDate" character varying NOT NULL, "cvv" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_97c08b6c8d5c1df81bf1a96c43e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."wallet_type_enum" AS ENUM('crypto', 'sn_balance', 'gbp_wallet')`);
        await queryRunner.query(`CREATE TABLE "wallet" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "type" "public"."wallet_type_enum" NOT NULL, "balance" numeric(10,2) NOT NULL DEFAULT '0', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "service" ADD "latitude" numeric(9,6) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "service" ADD "longitude" numeric(9,6) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "credit_card" ADD CONSTRAINT "FK_5af060e164a7e2764ed1b15589d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wallet" ADD CONSTRAINT "FK_35472b1fe48b6330cd349709564" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet" DROP CONSTRAINT "FK_35472b1fe48b6330cd349709564"`);
        await queryRunner.query(`ALTER TABLE "credit_card" DROP CONSTRAINT "FK_5af060e164a7e2764ed1b15589d"`);
        await queryRunner.query(`ALTER TABLE "service" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "service" DROP COLUMN "latitude"`);
        await queryRunner.query(`DROP TABLE "wallet"`);
        await queryRunner.query(`DROP TYPE "public"."wallet_type_enum"`);
        await queryRunner.query(`DROP TABLE "credit_card"`);
    }

}
