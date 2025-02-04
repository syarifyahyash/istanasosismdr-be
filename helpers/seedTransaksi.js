// const { PrismaClient } = require('@prisma/client');
// const { generateDummyTransaksi } = require('./fakerTransaksi');

// const prisma = new PrismaClient();

// async function seedTransaksi() {
//   try {
//     // Buat data dummy transaksi (misal: 5 transaksi)
//     const dummyTransaksi = await generateDummyTransaksi(2); // Pastikan menunggu hasil dari generateDummyTransaksi

//     // Insert ke database
//     for (const transaksi of dummyTransaksi) {
//       const { kode_transaksi, id_user, id_member, metode_bayar, total_transaksi, total_margin, detailTransaksi } = transaksi;

//       await prisma.transaksi.create({
//         data: {
//           kode_transaksi,
//           id_user,
//           id_member,
//           metode_bayar,
//           total_transaksi,
//           total_margin,
//           status_transaksi: 'selesai', // Default status transaksi
//           detailTransaksi: {
//             create: detailTransaksi.map((item) => ({
//               id_produk: item.id_produk,
//               jumlah: item.jumlah,
//               harga_beli: item.harga_beli,
//               harga_jual_cash: item.harga_jual_cash,
//               harga_jual_kredit: item.harga_jual_kredit,
//               margin: item.margin,
//               margin_toko_kredit: item.margin_toko_kredit,
//               shu_orang: item.shu_orang,
//               shu_toko: item.shu_toko,
//             })),
//           },
//         },
//       });
//     }

//     console.log('dummyTransaksi:', dummyTransaksi);
//     console.log('Data transaksi dummy berhasil di-insert!');
//   } catch (error) {
//     console.error('Terjadi kesalahan:', error.message);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// seedTransaksi();

const { PrismaClient } = require('@prisma/client');
const { generateDummyTransaksi } = require('./fakerTransaksi');

const prisma = new PrismaClient();

async function seedLargeTransaksi(batchSize, totalRecords) {
  try {
    console.time('SeedTransaksi'); // Untuk menghitung waktu eksekusi
    let totalInserted = 0;

    while (totalInserted < totalRecords) {
      const remaining = totalRecords - totalInserted;
      const currentBatchSize = Math.min(batchSize, remaining);

      // Generate batch data
      const dummyTransaksi = await generateDummyTransaksi(currentBatchSize);

      // Extract transaksi
      const transaksiData = dummyTransaksi.map((transaksi) => ({
        kode_transaksi: transaksi.kode_transaksi,
        id_user: transaksi.id_user,
        id_member: transaksi.id_member,
        metode_bayar: transaksi.metode_bayar,
        total_transaksi: transaksi.total_transaksi,
        total_margin: transaksi.total_margin,
        status_transaksi: 'selesai',
      }));

      // Insert batch transaksi
      await prisma.transaksi.createMany({ data: transaksiData });

      // Fetch the inserted transactions to get their IDs
      const insertedTransaksi = await prisma.transaksi.findMany({
        where: {
          kode_transaksi: {
            in: dummyTransaksi.map((transaksi) => transaksi.kode_transaksi),
          },
        },
      });

      // Map `kode_transaksi` to `id_transaksi`
      const kodeToIdMap = Object.fromEntries(
        insertedTransaksi.map((transaksi) => [transaksi.kode_transaksi, transaksi.id_transaksi])
      );

      // Prepare detailTransaksi data with the correct `id_transaksi`
      const detailTransaksiData = dummyTransaksi.flatMap((transaksi) =>
        transaksi.detailTransaksi.map((detail) => ({
          id_transaksi: kodeToIdMap[transaksi.kode_transaksi],
          id_produk: detail.id_produk,
          jumlah: detail.jumlah,
          harga_beli: detail.harga_beli,
          harga_jual_cash: detail.harga_jual_cash,
          harga_jual_kredit: detail.harga_jual_kredit,
          margin: detail.margin,
          margin_toko_kredit: detail.margin_toko_kredit,
          shu_orang: detail.shu_orang,
          shu_toko: detail.shu_toko,
        }))
      );

      // Insert batch detailTransaksi
      for (const detailBatch of chunkArray(detailTransaksiData, 1000)) {
        await prisma.detailTransaksi.createMany({ data: detailBatch });
      }

      totalInserted += currentBatchSize;
      console.log(`${totalInserted}/${totalRecords} transaksi berhasil di-insert.`);
    }

    console.timeEnd('SeedTransaksi');
    console.log('Seed selesai!');
  } catch (error) {
    console.error('Terjadi kesalahan:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Helper untuk membagi array menjadi batch kecil
function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

// Seed 1 juta transaksi dengan batch size 1000
seedLargeTransaksi(100, 1000);
