-- CreateTable
CREATE TABLE `User` (
    `id_user` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'KASIR') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MemberKoperasi` (
    `id_member` INTEGER NOT NULL AUTO_INCREMENT,
    `npk` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `jabatan` VARCHAR(191) NOT NULL,
    `total_hutang` DOUBLE NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MemberKoperasi_npk_key`(`npk`),
    PRIMARY KEY (`id_member`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PembayaranHutang` (
    `id_pembayaran` INTEGER NOT NULL AUTO_INCREMENT,
    `id_member` INTEGER NOT NULL,
    `id_transaksi` INTEGER NOT NULL,
    `jumlah_bayar` DOUBLE NOT NULL,
    `sisa_hutang_setelah_bayar` DOUBLE NOT NULL,
    `tanggal_bayar` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_pembayaran`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LaporanPersediaan` (
    `id_laporan` INTEGER NOT NULL AUTO_INCREMENT,
    `barcode` VARCHAR(191) NOT NULL,
    `nama_produk` VARCHAR(191) NOT NULL,
    `kategori` VARCHAR(191) NOT NULL,
    `sisa_stok` INTEGER NOT NULL,
    `harga_beli` DECIMAL(65, 30) NOT NULL,
    `harga_jual_cash` DECIMAL(65, 30) NOT NULL,
    `bulan` INTEGER NOT NULL,
    `tahun` INTEGER NOT NULL,
    `tanggal_laporan` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_laporan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Produk` (
    `id_produk` INTEGER NOT NULL AUTO_INCREMENT,
    `id_kategori` INTEGER NOT NULL,
    `barcode` VARCHAR(191) NULL,
    `nama_produk` VARCHAR(191) NOT NULL,
    `unit` ENUM('pcs', 'dus', 'pack', 'kg', 'botol') NULL,
    `harga_beli` DOUBLE NOT NULL,
    `margin` DOUBLE NULL,
    `margin_kredit` DOUBLE NULL,
    `harga_jual_cash` DOUBLE NULL,
    `harga_jual_kredit` DOUBLE NULL,
    `stok` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Produk_barcode_key`(`barcode`),
    PRIMARY KEY (`id_produk`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kategori` (
    `id_kategori` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_kategori` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_kategori`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MetodeBayar` (
    `id_metode` INTEGER NOT NULL AUTO_INCREMENT,
    `jenis_metode` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_metode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaksi` (
    `id_transaksi` INTEGER NOT NULL AUTO_INCREMENT,
    `kode_transaksi` VARCHAR(191) NOT NULL,
    `id_user` INTEGER NOT NULL,
    `id_member` INTEGER NULL,
    `metode_bayar` INTEGER NOT NULL,
    `total_transaksi` DOUBLE NOT NULL,
    `sisa_hutang` DOUBLE NOT NULL,
    `total_margin` DOUBLE NOT NULL,
    `status_transaksi` ENUM('belum_lunas', 'lunas') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Transaksi_kode_transaksi_key`(`kode_transaksi`),
    PRIMARY KEY (`id_transaksi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetailTransaksi` (
    `id_detail_transaksi` INTEGER NOT NULL AUTO_INCREMENT,
    `id_transaksi` INTEGER NOT NULL,
    `id_produk` INTEGER NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `harga_beli` DOUBLE NOT NULL,
    `harga_jual_cash` DOUBLE NULL,
    `harga_jual_kredit` DOUBLE NULL,
    `margin` DOUBLE NULL,
    `margin_toko_kredit` DOUBLE NULL,
    `shu_orang` DOUBLE NULL,
    `shu_toko` DOUBLE NULL,

    PRIMARY KEY (`id_detail_transaksi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
ALTER TABLE `PembayaranHutang` ADD CONSTRAINT `PembayaranHutang_id_member_fkey` FOREIGN KEY (`id_member`) REFERENCES `MemberKoperasi`(`id_member`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PembayaranHutang` ADD CONSTRAINT `PembayaranHutang_id_transaksi_fkey` FOREIGN KEY (`id_transaksi`) REFERENCES `Transaksi`(`id_transaksi`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Produk` ADD CONSTRAINT `Produk_id_kategori_fkey` FOREIGN KEY (`id_kategori`) REFERENCES `Kategori`(`id_kategori`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaksi` ADD CONSTRAINT `Transaksi_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaksi` ADD CONSTRAINT `Transaksi_id_member_fkey` FOREIGN KEY (`id_member`) REFERENCES `MemberKoperasi`(`id_member`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaksi` ADD CONSTRAINT `Transaksi_metode_bayar_fkey` FOREIGN KEY (`metode_bayar`) REFERENCES `MetodeBayar`(`id_metode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailTransaksi` ADD CONSTRAINT `DetailTransaksi_id_transaksi_fkey` FOREIGN KEY (`id_transaksi`) REFERENCES `Transaksi`(`id_transaksi`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailTransaksi` ADD CONSTRAINT `DetailTransaksi_id_produk_fkey` FOREIGN KEY (`id_produk`) REFERENCES `Produk`(`id_produk`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockLog` ADD CONSTRAINT `StockLog_id_produk_fkey` FOREIGN KEY (`id_produk`) REFERENCES `Produk`(`id_produk`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockLog` ADD CONSTRAINT `StockLog_performed_by_fkey` FOREIGN KEY (`performed_by`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;
