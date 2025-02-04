const { PrismaClient } = require('@prisma/client');
const { generateDummyMembers } = require('./fakerMembers');

const prisma = new PrismaClient();

async function seedMembers() {
  const dummyMembers = generateDummyMembers(10); // Buat 10 anggota dummy

  try {
    // Insert data dummy ke database
    await prisma.memberKoperasi.createMany({
      data: dummyMembers,
    });

    console.log('Data anggota dummy berhasil di-insert!');
    console.log(dummyMembers);
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedMembers();
