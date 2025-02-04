const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
  try {
    // const members = [
    //   { npk: "181106019", nama: "AKHMAD FAIZAL", jabatan: "ANGGOTA" },
    //   { npk: "170197001", nama: "SUJITO", jabatan: "ANGGOTA" },
    //   { npk: "169104024", nama: "DWI JOKO PURNOMO", jabatan: "ANGGOTA" },
    //   { npk: "169102006", nama: "TRIWILANGSIH", jabatan: "ANGGOTA" },
    //   { npk: "176106014", nama: "MARINUS", jabatan: "ANGGOTA" },
    //   { npk: "170108018", nama: "FRANS SUADY BACHRI", jabatan: "ANGGOTA" },
    //   { npk: "170111023", nama: "BAKRI", jabatan: "ANGGOTA" },
    //   { npk: "170102004", nama: "NURUL QOMAR", jabatan: "ANGGOTA" },
    //   { npk: "169102018", nama: "AGUS SUTRISNO", jabatan: "ANGGOTA" },
    //   { npk: "169102009", nama: "ISKANDAR ZULKARNAIN", jabatan: "ANGGOTA" },
    //   { npk: "173108019", nama: "NANIK HERAWATI", jabatan: "ANGGOTA" },
    //   { npk: "180115021", nama: "SUTIKNO", jabatan: "ANGGOTA" },
    //   { npk: "176111001", nama: "ARIF HERMAWAN", jabatan: "ANGGOTA" },
    //   { npk: "172108021", nama: "MASRUR AMPERAWAN", jabatan: "ANGGOTA" },
    //   { npk: "189115041", nama: "AHMAD KHOIRUL ANAM", jabatan: "ANGGOTA" },
    //   { npk: "190115003", nama: "BAYU FEBRIANDIKA FARISTIANTON", jabatan: "ANGGOTA", },
    //   { npk: "185115005", nama: "HENDRIX ES PRAYETNO", jabatan: "ANGGOTA" },
    //   { npk: "170109006", nama: "ZAINAH", jabatan: "ANGGOTA" },
    //   { npk: "171112087", nama: "RUDI HARTONO", jabatan: "ANGGOTA" },
    //   { npk: "174115239", nama: "MOKHAMAD AMIN", jabatan: "ANGGOTA" },
    //   { npk: "169102037", nama: "HERMANTO", jabatan: "ANGGOTA" },
    //   { npk: "178114003", nama: "ACHMAD SUTRISNO", jabatan: "ANGGOTA" },
    //   { npk: "169196087", nama: "SUBASRAWI", jabatan: "ANGGOTA" },
    //   { npk: "175113107", nama: "SULISTIANI", jabatan: "ANGGOTA" },
    //   { npk: "168115157", nama: "S. APSANIYATUN", jabatan: "ANGGOTA" },
    //   { npk: "176115358", nama: "ABDUL BARI", jabatan: "ANGGOTA" },
    //   { npk: "191114001", nama: "ACH. HASIN ASHARI", jabatan: "ANGGOTA" },
    //   { npk: "172114015", nama: "DARMAWATI", jabatan: "ANGGOTA" },
    //   { npk: "181114022", nama: "INDAH DAMAYANTI", jabatan: "ANGGOTA" },
    //   { npk: "180115251", nama: "NURMANINGSIH", jabatan: "ANGGOTA" },
    //   { npk: "175113080", nama: "R. TAUFIKUL HIDAYAT", jabatan: "ANGGOTA" },
    //   { npk: "177114023", nama: "RA. NURUL HERMIN SESWANTI", jabatan: "ANGGOTA",},
    //   { npk: "177113021", nama: "TAUFIQUR RAHMAN", jabatan: "ANGGOTA" },
    //   { npk: "178112015", nama: "TRI HARTAWAN SOETANTO", jabatan: "ANGGOTA" },
    //   { npk: "174114194", nama: "WIDODO ARI ISTANTO", jabatan: "ANGGOTA" },
    //   { npk: "178115047", nama: "YETTY SOEDARMI", jabatan: "ANGGOTA" },
    //   { npk: "192115058", nama: "DARUL HIDAYAT", jabatan: "ANGGOTA" },
    //   { npk: "188115020", nama: "JEPRI HADI SUSANTO", jabatan: "ANGGOTA" },
    //   { npk: "189115010", nama: "FEBRI ARI KUSMINTO", jabatan: "ANGGOTA" },
    //   { npk: "186115003", nama: "ARIF HUBBAN NAUFAL", jabatan: "ANGGOTA" },
    //   { npk: "190115011", nama: "PUJIYANTO", jabatan: "ANGGOTA" },
    //   // ANGGOTA 41

    //   { npk: "180113018", nama: "IWAN HADI SUNARYO", jabatan: "ANGGOTA" },
    //   { npk: "177115275", nama: "ABD. HADI", jabatan: "ANGGOTA" },
    //   { npk: "178115204", nama: "EDY SUGIANTORO", jabatan: "ANGGOTA" },
    //   { npk: "175112039", nama: "CHAIRUL SALEH", jabatan: "ANGGOTA" },
    //   { npk: "181115064", nama: "ACHMAD SUGIHARTO", jabatan: "ANGGOTA" },
    //   { npk: "172114166", nama: "MUJIB", jabatan: "ANGGOTA" },
    //   { npk: "168109063", nama: "SURYA DARMA", jabatan: "ANGGOTA" },
    //   { npk: "176113019", nama: "ABDUL AZIZ", jabatan: "ANGGOTA" },
    //   { npk: "176115153", nama: "MADNADI", jabatan: "ANGGOTA" },
    //   // ANGGOTA 9

    //   { npk: "169100006", nama: "RIFA'I", jabatan: "ANGGOTA" },
    //   { npk: "171108004", nama: "PUGUH PAMBUDI", jabatan: "ANGGOTA" },
    //   { npk: "169109067", nama: "AHMAD RAFIK", jabatan: "ANGGOTA" },
    //   { npk: "173114093", nama: "MANSUR", jabatan: "ANGGOTA" },
    //   { npk: "174113014", nama: "MUHAMMAD SUYITNO", jabatan: "ANGGOTA" },
    //   { npk: "178115122", nama: "IMAM SYAFI'I", jabatan: "ANGGOTA" },
    //   { npk: "173115205", nama: "MOHAMMAD IRHAMNI", jabatan: "ANGGOTA" },
    //   { npk: "182115097", nama: "MOH. AMIN", jabatan: "ANGGOTA" },
    //   { npk: "171112099", nama: "ABDUR RAHMAN", jabatan: "ANGGOTA" },
    //   { npk: "173115009", nama: "ISKANDAR", jabatan: "ANGGOTA" },
    //   { npk: "171115269", nama: "M. HAMDAN ZAMRONI", jabatan: "ANGGOTA" },
    //   { npk: "173114110", nama: "MOHAMMAD SALEH", jabatan: "ANGGOTA" },
    //   { npk: "179114116", nama: "HARIYANTO", jabatan: "ANGGOTA" },
    //   { npk: "172113091", nama: "SYAIFUL BAHRI", jabatan: "ANGGOTA" },
    //   { npk: "170109072", nama: "ADNAN", jabatan: "ANGGOTA" },
    //   { npk: "170114105", nama: "TRISNO", jabatan: "ANGGOTA" },
    //   { npk: "174112077", nama: "YUHYI", jabatan: "ANGGOTA" },
    //   { npk: "176115404", nama: "MOHAMMAD BUDIARTO", jabatan: "ANGGOTA" },
    //   { npk: "176115302", nama: "PUTRO WAGE PRIHATIN", jabatan: "ANGGOTA" },
    //   // ANGGOTA 19

    //   { npk: "171102025", nama: "SARIHOL", jabatan: "ANGGOTA" },
    //   { npk: "168105009", nama: "DUL JALAL", jabatan: "ANGGOTA" },
    //   { npk: "169109013", nama: "AKHMAD WAHYUDI", jabatan: "ANGGOTA" },
    //   { npk: "170105012", nama: "AHMATRULLAH", jabatan: "ANGGOTA" },
    //   { npk: "174114012", nama: "SAMSURI", jabatan: "ANGGOTA" },
    //   { npk: "172115340", nama: "SAHREN", jabatan: "ANGGOTA" },
    //   { npk: "170196023", nama: "ZAINAL ARIFIN", jabatan: "ANGGOTA" },
    //   { npk: "190115047", nama: "KHAIRUL ALIM", jabatan: "ANGGOTA" },
    //   { npk: "170114031", nama: "MOHAMMAD HUSIN", jabatan: "ANGGOTA" },
    //   { npk: "168115178", nama: "R. AGUS WAHYUDI", jabatan: "ANGGOTA" },
    //   { npk: "169115001", nama: "SUHARDI", jabatan: "ANGGOTA" },
    //   { npk: "169113117", nama: "HASARI", jabatan: "ANGGOTA" },
    //   { npk: "179115036", nama: "MULIWAN", jabatan: "ANGGOTA" },
    //   { npk: "177115278", nama: "HAFIDIYANTO", jabatan: "ANGGOTA" },
    //   { npk: "176115133", nama: "SAHRIN", jabatan: "ANGGOTA" },
    //   // ANGGOTA 15

    //   { npk: "171103004", nama: "AGUS SUSANTO", jabatan: "ANGGOTA" },
    //   { npk: "171112014", nama: "MOHAMMAD HASAN", jabatan: "ANGGOTA" },
    //   { npk: "181114050", nama: "SUPRAPTO", jabatan: "ANGGOTA" },
    //   { npk: "172111014", nama: "MOH. SYAFI'I", jabatan: "ANGGOTA" },
    //   { npk: "173113004", nama: "ANWARI", jabatan: "ANGGOTA" },
    //   { npk: "180114009", nama: "MOHAMMAD HOSEN", jabatan: "ANGGOTA" },
    //   { npk: "173112028", nama: "MOHAMMAD RIZALI HADI", jabatan: "ANGGOTA" },
    //   { npk: "189115023", nama: "FAIZUN ARAFAT", jabatan: "ANGGOTA" },
    //   { npk: "173112026", nama: "MADSAID", jabatan: "ANGGOTA" },
    //   { npk: "168113064", nama: "SYAMSUL", jabatan: "ANGGOTA" },
    //   { npk: "180115212", nama: "NIHWAN", jabatan: "ANGGOTA" },
    //   { npk: "180115060", nama: "HAINUR RASID", jabatan: "ANGGOTA" },
    //   { npk: "168111029", nama: "MUSAHNAN", jabatan: "ANGGOTA" },
    //   { npk: "173115104", nama: "ABDULLAH", jabatan: "ANGGOTA" },
    //   { npk: "168113086", nama: "LAITONG", jabatan: "ANGGOTA" },
    //   { npk: "172115056", nama: "MURAMIN", jabatan: "ANGGOTA" },
    //   { npk: "177115296", nama: "BUIRAN", jabatan: "ANGGOTA" },
    //   { npk: "178115168", nama: "MOATEM", jabatan: "ANGGOTA" },
    //   { npk: "170114119", nama: "SUDAHNAN", jabatan: "ANGGOTA" },
    //   { npk: "173112064", nama: "SULIMAN", jabatan: "ANGGOTA" },
    //   { npk: "169115043", nama: "JASULI", jabatan: "ANGGOTA" },
    //   { npk: "168115193", nama: "SIMBAN", jabatan: "ANGGOTA" },
    //   { npk: "173115347", nama: "HABAR", jabatan: "ANGGOTA" },
    //   { npk: "176115316", nama: "MOHAMMAD ABDUL SATTAR", jabatan: "ANGGOTA" },
    //   // ANGGOTA 24

    //   { npk: "180114005", nama: "NUR MUDAKKIR", jabatan: "ANGGOTA" },
    //   { npk: "176115411", nama: "JUJEK", jabatan: "ANGGOTA" },
    //   { npk: "171114026", nama: "KAMARIYAH", jabatan: "ANGGOTA" },
    //   { npk: "180115033", nama: "AINUR RASYID", jabatan: "ANGGOTA" },
    //   { npk: "172113118", nama: "MOHAMMAD SAFIK", jabatan: "ANGGOTA" },
    //   { npk: "175115058", nama: "ABDU", jabatan: "ANGGOTA" },
    //   { npk: "174115095", nama: "JALALI", jabatan: "ANGGOTA" },
    //   { npk: "181115053", nama: "MOH. RUSLAN", jabatan: "ANGGOTA" },
    //   { npk: "172115260", nama: "M. ERFAN MAKMUR", jabatan: "ANGGOTA" },
    //   { npk: "179115056", nama: "BARMAWI", jabatan: "ANGGOTA" },
    //   { npk: "170115124", nama: "AHMAD YANI", jabatan: "ANGGOTA" },
    //   { npk: "172115205", nama: "MOH. JAMRI", jabatan: "ANGGOTA" },
    //   { npk: "176115192", nama: "A. LAMU", jabatan: "ANGGOTA" },
    //   { npk: "168115186", nama: "HASIK", jabatan: "ANGGOTA" },
    //   // ANGGOTA 14

    //   { npk: "174115189", nama: "EDI HARIYANTO", jabatan: "ANGGOTA" },
    //   { npk: "174115257", nama: "HAMIDI", jabatan: "ANGGOTA" },
    //   { npk: "174115270", nama: "FATHOR RAHMAN", jabatan: "ANGGOTA" },
    //   // ANGGOTA 3

    //   { npk: "172112116", nama: "IBNU HARIADY", jabatan: "ANGGOTA" },
    //   { npk: "178115005", nama: "TURSIADI", jabatan: "ANGGOTA" },
    //   { npk: "177115146", nama: "MAYLIZE ZYATRO", jabatan: "ANGGOTA" },
    //   // ANGGOTA 3
    // ];

    // let createdMemberCount = 0;
    // const memberUpsertPromises = members.map(async (member) => {
    //   const existingMember = await prisma.memberKoperasi.findUnique({
    //     where: { npk: member.npk },
    //   });

    //   if (!existingMember) {
    //     await prisma.memberKoperasi.create({ data: member });
    //     createdMemberCount++;
    //   }
    // });
    // await Promise.all(memberUpsertPromises);
    // console.log(
    //   `Seeding MemberKoperasi selesai. ${createdMemberCount} data baru telah ditambahkan.`
    // );

    const hashedPassword = await bcrypt.hash("admin00", 10);
    const users = [
      {
        name: "Admin",
        email: "admin@gmail.com",
        password: hashedPassword, // Pastikan ini HASH yang benar
        role: "ADMIN",
      },
    ];

    let createdUserCount = 0;
    const userUpsertPromises = users.map(async (user) => {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });
      if (!existingUser) {
        await prisma.user.create({ data: user });
        createdUserCount++;
      }
    });
    await Promise.all(userUpsertPromises);
    console.log(
      `Seeding User selesai. ${createdUserCount} data baru telah ditambahkan.`
    );

    const metodeBayarData = [
      { jenis_metode: "Cash" },
      { jenis_metode: "Kredit" },
    ];

    let createdMetodeBayarCount = 0;
    const metodeBayarUpsertPromises = metodeBayarData.map(async (metode) => {
      const existingMetodeBayar = await prisma.metodeBayar.findUnique({
        where: { jenis_metode: metode.jenis_metode },
      });
      if (!existingMetodeBayar) {
        await prisma.metodeBayar.create({ data: metode });
        createdMetodeBayarCount++;
      }
    });
    console.log(
      `Seeding MetodeBayar selesai. ${createdMetodeBayarCount} data baru telah ditambahkan.`
    );
  } catch (e) {
    console.error("Error seeding data:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
