-- AlterTable
ALTER TABLE `memberkoperasi` ADD COLUMN `total_hutang` DOUBLE NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `PembayaranHutang` (
    `id_pembayaran` INTEGER NOT NULL AUTO_INCREMENT,
    `id_member` INTEGER NOT NULL,
    `id_transaksi` INTEGER NOT NULL,
    `jumlah_bayar` DOUBLE NOT NULL,
    `tanggal_bayar` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_pembayaran`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PembayaranHutang` ADD CONSTRAINT `PembayaranHutang_id_member_fkey` FOREIGN KEY (`id_member`) REFERENCES `MemberKoperasi`(`id_member`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PembayaranHutang` ADD CONSTRAINT `PembayaranHutang_id_transaksi_fkey` FOREIGN KEY (`id_transaksi`) REFERENCES `Transaksi`(`id_transaksi`) ON DELETE RESTRICT ON UPDATE CASCADE;
