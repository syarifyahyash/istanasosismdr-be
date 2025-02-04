-- AlterTable
ALTER TABLE `produk` MODIFY `stok` INTEGER NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `StockLog` (
    `id_log` INTEGER NOT NULL AUTO_INCREMENT,
    `id_produk` INTEGER NOT NULL,
    `performed_by` INTEGER NOT NULL,
    `change_type` VARCHAR(191) NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_log`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StockLog` ADD CONSTRAINT `StockLog_id_produk_fkey` FOREIGN KEY (`id_produk`) REFERENCES `Produk`(`id_produk`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockLog` ADD CONSTRAINT `StockLog_performed_by_fkey` FOREIGN KEY (`performed_by`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;
