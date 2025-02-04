/*
  Warnings:

  - Added the required column `sisa_hutang_setelah_bayar` to the `PembayaranHutang` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sisa_hutang` to the `Transaksi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pembayaranhutang` ADD COLUMN `sisa_hutang_setelah_bayar` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `transaksi` ADD COLUMN `sisa_hutang` DOUBLE NOT NULL;
