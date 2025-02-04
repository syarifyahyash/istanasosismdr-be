/*
  Warnings:

  - Made the column `stok` on table `produk` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `produk` MODIFY `stok` INTEGER NOT NULL DEFAULT 0;
