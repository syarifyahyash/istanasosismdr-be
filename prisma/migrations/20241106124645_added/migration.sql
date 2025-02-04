/*
  Warnings:

  - A unique constraint covering the columns `[kode_transaksi]` on the table `Transaksi` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `kode_transaksi` to the `Transaksi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `transaksi` ADD COLUMN `kode_transaksi` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Transaksi_kode_transaksi_key` ON `Transaksi`(`kode_transaksi`);
