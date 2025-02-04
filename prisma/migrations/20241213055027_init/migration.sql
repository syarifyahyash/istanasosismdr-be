/*
  Warnings:

  - You are about to drop the column `nik` on the `memberkoperasi` table. All the data in the column will be lost.
  - The values [selesai,pending,dibatalkan] on the enum `Transaksi_status_transaksi` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[npk]` on the table `MemberKoperasi` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `npk` to the `MemberKoperasi` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `MemberKoperasi_nik_key` ON `memberkoperasi`;

-- AlterTable
ALTER TABLE `memberkoperasi` DROP COLUMN `nik`,
    ADD COLUMN `npk` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `transaksi` MODIFY `status_transaksi` ENUM('belum_lunas', 'lunas') NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `MemberKoperasi_npk_key` ON `MemberKoperasi`(`npk`);
