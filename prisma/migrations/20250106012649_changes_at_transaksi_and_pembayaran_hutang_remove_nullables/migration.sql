/*
  Warnings:

  - Made the column `harga_jual_cash` on table `detailtransaksi` required. This step will fail if there are existing NULL values in that column.
  - Made the column `harga_jual_cash` on table `produk` required. This step will fail if there are existing NULL values in that column.
  - Made the column `harga_jual_kredit` on table `produk` required. This step will fail if there are existing NULL values in that column.
  - Made the column `margin` on table `produk` required. This step will fail if there are existing NULL values in that column.
  - Made the column `margin_kredit` on table `produk` required. This step will fail if there are existing NULL values in that column.
  - Made the column `unit` on table `produk` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sisa_hutang` on table `transaksi` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `detailtransaksi` MODIFY `harga_jual_cash` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `produk` MODIFY `harga_jual_cash` DOUBLE NOT NULL,
    MODIFY `harga_jual_kredit` DOUBLE NOT NULL,
    MODIFY `margin` DOUBLE NOT NULL,
    MODIFY `margin_kredit` DOUBLE NOT NULL,
    MODIFY `unit` ENUM('pcs', 'dus', 'pack') NOT NULL;

-- AlterTable
ALTER TABLE `transaksi` MODIFY `sisa_hutang` DOUBLE NOT NULL;
