/*
  Warnings:

  - Added the required column `margin` to the `Transaksi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `transaksi` ADD COLUMN `margin` DOUBLE NOT NULL,
    MODIFY `status_transaksi` ENUM('selesai', 'pending', 'dibatalkan', 'lunas') NOT NULL;
