/*
  Warnings:

  - You are about to drop the column `margin` on the `transaksi` table. All the data in the column will be lost.
  - Added the required column `total_margin` to the `Transaksi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `transaksi` DROP COLUMN `margin`,
    ADD COLUMN `total_margin` DOUBLE NOT NULL;
