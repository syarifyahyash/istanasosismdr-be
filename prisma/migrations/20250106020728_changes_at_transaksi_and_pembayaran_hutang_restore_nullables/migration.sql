-- AlterTable
ALTER TABLE `detailtransaksi` MODIFY `harga_jual_cash` DOUBLE NULL;

-- AlterTable
ALTER TABLE `memberkoperasi` MODIFY `total_hutang` DOUBLE NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `produk` MODIFY `harga_jual_cash` DOUBLE NULL,
    MODIFY `harga_jual_kredit` DOUBLE NULL,
    MODIFY `margin` DOUBLE NULL,
    MODIFY `margin_kredit` DOUBLE NULL,
    MODIFY `unit` ENUM('pcs', 'dus', 'pack') NULL;
