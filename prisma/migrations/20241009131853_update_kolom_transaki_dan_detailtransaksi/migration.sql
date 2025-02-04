/*
  Warnings:

  - You are about to drop the column `harga_jual` on the `detailtransaksi` table. All the data in the column will be lost.
  - You are about to drop the column `margin_cash` on the `transaksi` table. All the data in the column will be lost.
  - You are about to drop the column `margin_kredit` on the `transaksi` table. All the data in the column will be lost.
  - You are about to alter the column `metode_bayar` on the `transaksi` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Int`.

*/
-- AlterTable
ALTER TABLE `detailtransaksi` DROP COLUMN `harga_jual`,
    ADD COLUMN `harga_jual_cash` DOUBLE NULL,
    ADD COLUMN `harga_jual_kredit` DOUBLE NULL,
    ADD COLUMN `margin` DOUBLE NULL,
    ADD COLUMN `margin_toko_kredit` DOUBLE NULL,
    ADD COLUMN `shu_orang` DOUBLE NULL,
    ADD COLUMN `shu_toko` DOUBLE NULL;

-- AlterTable
ALTER TABLE `transaksi` DROP COLUMN `margin_cash`,
    DROP COLUMN `margin_kredit`,
    MODIFY `metode_bayar` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `MetodeBayar` (
    `id_metode` INTEGER NOT NULL AUTO_INCREMENT,
    `jenis_metode` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_metode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Transaksi` ADD CONSTRAINT `Transaksi_metode_bayar_fkey` FOREIGN KEY (`metode_bayar`) REFERENCES `MetodeBayar`(`id_metode`) ON DELETE RESTRICT ON UPDATE CASCADE;
