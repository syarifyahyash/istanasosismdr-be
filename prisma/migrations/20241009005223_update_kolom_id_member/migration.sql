/*
  Warnings:

  - The primary key for the `memberkoperasi` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `memberkoperasi` table. All the data in the column will be lost.
  - Added the required column `id_member` to the `MemberKoperasi` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `transaksi` DROP FOREIGN KEY `Transaksi_id_member_fkey`;

-- AlterTable
ALTER TABLE `memberkoperasi` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `id_member` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id_member`);

-- AddForeignKey
ALTER TABLE `Transaksi` ADD CONSTRAINT `Transaksi_id_member_fkey` FOREIGN KEY (`id_member`) REFERENCES `MemberKoperasi`(`id_member`) ON DELETE SET NULL ON UPDATE CASCADE;
