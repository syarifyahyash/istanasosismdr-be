/*
  Warnings:

  - The primary key for the `memberkoperasi` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id_member` on the `memberkoperasi` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `id_member` on the `transaksi` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `transaksi` DROP FOREIGN KEY `Transaksi_id_member_fkey`;

-- AlterTable
ALTER TABLE `memberkoperasi` DROP PRIMARY KEY,
    MODIFY `id_member` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id_member`);

-- AlterTable
ALTER TABLE `transaksi` MODIFY `id_member` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Transaksi` ADD CONSTRAINT `Transaksi_id_member_fkey` FOREIGN KEY (`id_member`) REFERENCES `MemberKoperasi`(`id_member`) ON DELETE SET NULL ON UPDATE CASCADE;
