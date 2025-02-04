/*
  Warnings:

  - A unique constraint covering the columns `[nik]` on the table `MemberKoperasi` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nik` to the `MemberKoperasi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `memberkoperasi` ADD COLUMN `nik` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `MemberKoperasi_nik_key` ON `MemberKoperasi`(`nik`);
