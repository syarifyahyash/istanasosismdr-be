/*
  Warnings:

  - You are about to drop the column `id_transaksi` on the `pembayaranhutang` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `pembayaranhutang` DROP FOREIGN KEY `PembayaranHutang_id_transaksi_fkey`;

-- AlterTable
ALTER TABLE `pembayaranhutang` DROP COLUMN `id_transaksi`,
    ADD COLUMN `sisa_hutang_setelah_bayar` DOUBLE NULL;

-- AlterTable
ALTER TABLE `transaksi` ADD COLUMN `sisa_hutang` DOUBLE NULL;
