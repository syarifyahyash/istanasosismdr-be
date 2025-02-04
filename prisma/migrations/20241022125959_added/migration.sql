/*
  Warnings:

  - A unique constraint covering the columns `[barcode]` on the table `Produk` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `produk` ADD COLUMN `barcode` VARCHAR(191) NULL,
    ADD COLUMN `harga_jual_cash` DOUBLE NULL,
    ADD COLUMN `harga_jual_kredit` DOUBLE NULL,
    ADD COLUMN `margin` DOUBLE NULL,
    ADD COLUMN `stok` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Produk_barcode_key` ON `Produk`(`barcode`);
