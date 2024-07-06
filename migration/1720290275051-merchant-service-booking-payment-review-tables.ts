import { MigrationInterface, QueryRunner } from "typeorm";

export class MerchantServiceBookingPaymentReviewTables1720290275051 implements MigrationInterface {
    name = 'MerchantServiceBookingPaymentReviewTables1720290275051'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "review" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "merchantId" integer NOT NULL, "bookingId" integer NOT NULL, "rating" integer NOT NULL, "comment" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "service" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "price" numeric(10,2) NOT NULL, "merchantId" integer NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_85a21558c006647cd76fdce044b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "merchant" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "qrCodeUrl" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_9a3850e0537d869734fc9bff5d6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."payment_method_enum" AS ENUM('credit_card', 'debit_card', 'crypto', 'sn_balance', 'gbp_wallet')`);
        await queryRunner.query(`CREATE TABLE "payment" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "bookingId" integer NOT NULL, "amount" numeric(10,2) NOT NULL, "method" "public"."payment_method_enum" NOT NULL, "receiptUrl" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "REL_5738278c92c15e1ec9d27e3a09" UNIQUE ("bookingId"), CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."booking_status_enum" AS ENUM('pending', 'completed')`);
        await queryRunner.query(`CREATE TYPE "public"."booking_paymentstatus_enum" AS ENUM('unpaid', 'paid')`);
        await queryRunner.query(`CREATE TABLE "booking" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "serviceId" integer NOT NULL, "merchantId" integer NOT NULL, "bookingDate" TIMESTAMP NOT NULL, "status" "public"."booking_status_enum" NOT NULL DEFAULT 'pending', "paymentStatus" "public"."booking_paymentstatus_enum" NOT NULL DEFAULT 'unpaid', "paymentId" integer, "reviewId" integer, CONSTRAINT "REL_14223cf3883f8f74019bf60ded" UNIQUE ("paymentId"), CONSTRAINT "REL_37f6e16524888b82a7d00515b4" UNIQUE ("reviewId"), CONSTRAINT "PK_49171efc69702ed84c812f33540" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_1337f93918c70837d3cea105d39" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_f37df7003658cdfef3ccce3f8f1" FOREIGN KEY ("merchantId") REFERENCES "merchant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "service" ADD CONSTRAINT "FK_e61b46720de5254567feb554ef4" FOREIGN KEY ("merchantId") REFERENCES "merchant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_b046318e0b341a7f72110b75857" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_5738278c92c15e1ec9d27e3a098" FOREIGN KEY ("bookingId") REFERENCES "booking"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_336b3f4a235460dc93645fbf222" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_e812cafb996fae4e9636ffe294f" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_529603ae0cbf03b9c31194ce29b" FOREIGN KEY ("merchantId") REFERENCES "merchant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_14223cf3883f8f74019bf60ded5" FOREIGN KEY ("paymentId") REFERENCES "payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_37f6e16524888b82a7d00515b4f" FOREIGN KEY ("reviewId") REFERENCES "review"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_37f6e16524888b82a7d00515b4f"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_14223cf3883f8f74019bf60ded5"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_529603ae0cbf03b9c31194ce29b"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_e812cafb996fae4e9636ffe294f"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_336b3f4a235460dc93645fbf222"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_5738278c92c15e1ec9d27e3a098"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_b046318e0b341a7f72110b75857"`);
        await queryRunner.query(`ALTER TABLE "service" DROP CONSTRAINT "FK_e61b46720de5254567feb554ef4"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_f37df7003658cdfef3ccce3f8f1"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_1337f93918c70837d3cea105d39"`);
        await queryRunner.query(`DROP TABLE "booking"`);
        await queryRunner.query(`DROP TYPE "public"."booking_paymentstatus_enum"`);
        await queryRunner.query(`DROP TYPE "public"."booking_status_enum"`);
        await queryRunner.query(`DROP TABLE "payment"`);
        await queryRunner.query(`DROP TYPE "public"."payment_method_enum"`);
        await queryRunner.query(`DROP TABLE "merchant"`);
        await queryRunner.query(`DROP TABLE "service"`);
        await queryRunner.query(`DROP TABLE "review"`);
    }

}
