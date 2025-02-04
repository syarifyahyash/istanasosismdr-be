const { fakerID_ID : faker } = require('@faker-js/faker');

// Set localization ke Indonesia
faker.locale = 'id_ID';

// Fungsi untuk membuat data dummy anggota koperasi
function generateDummyMembers(count) {
  const members = [];

  for (let i = 0; i < count; i++) {
    members.push({
      npk: faker.number.int(10000000000, 99999999999).toString(), // NIK/PHT 16 digit
      nama: faker.person.fullName(),            // Nama lengkap sesuai lokal Indonesia
      jabatan: 'ANGGOTA',                     // Jabatan default
    });
  }

  return members;
}

module.exports = {
  generateDummyMembers,
};
