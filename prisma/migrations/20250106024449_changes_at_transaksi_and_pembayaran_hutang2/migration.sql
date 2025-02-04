/*
  Warnings:

  - You are about to drop the column `sisa_hutang_setelah_bayar` on the `pembayaranhutang` table. All the data in the column will be lost.
  - You are about to drop the column `sisa_hutang` on the `transaksi` table. All the data in the column will be lost.
  - Made the column `total_hutang` on table `memberkoperasi` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `id_transaksi` to the `PembayaranHutang` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `memberkoperasi` MODIFY `total_hutang` DOUBLE NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `pembayaranhutang` DROP COLUMN `sisa_hutang_setelah_bayar`,
    ADD COLUMN `id_transaksi` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `transaksi` DROP COLUMN `sisa_hutang`;

-- AddForeignKey
ALTER TABLE `PembayaranHutang` ADD CONSTRAINT `PembayaranHutang_id_transaksi_fkey` FOREIGN KEY (`id_transaksi`) REFERENCES `Transaksi`(`id_transaksi`) ON DELETE RESTRICT ON UPDATE CASCADE;
