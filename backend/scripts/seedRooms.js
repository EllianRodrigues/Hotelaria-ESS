// Script para adicionar dados de teste de rooms
import db from '../src/sqlite/db.js';
import Hotel from '../src/models/hotel.js';
import Room from '../src/models/room.js';
import Admin from '../src/models/admin.js';

async function seedRooms() {
  try {
    console.log('🌱 Iniciando seed de rooms...');

    // Clear existing tables (only if they exist)

     await new Promise((res, rej) => db.run('DELETE FROM reservations', (err) => err ? rej(err) : res()));
    console.log('🗑️ Tabela de reservas limpa');
    await new Promise((res, rej) => db.run('DELETE FROM rooms', (err) => err ? rej(err) : res()));
    console.log('🗑️ Tabela de quartos limpa');
    await new Promise((res, rej) => db.run('DELETE FROM hotels', (err) => err ? rej(err) : res()));
    console.log('🗑️ Tabela de hotéis limpa');
    await new Promise((res, rej) => db.run('DELETE FROM admins', (err) => err ? rej(err) : res())); // Limpa a tabela de admins
    console.log('🗑️ Tabela de admins limpa');

    const timestamp = Date.now();
    const hotel1 = await Hotel.create('Hotel Copacabana Palace', `hotel1@seed${timestamp}.com`, '12345678901234', 'password123');
    const hotel2 = await Hotel.create('Hotel Fasano', `hotel2@seed${timestamp}.com`, '98765432109876', 'password123');
    const hotel3 = await Hotel.create('Hotel Unique', `hotel3@seed${timestamp}.com`, '11111111111111', 'password123');
    console.log('✅ Hotéis criados:', hotel1.id, hotel2.id, hotel3.id);

    console.log('👤 Criando usuário admin...');
    await Admin.create('Admin User', 'admin@test.com', 'admin123');
    console.log('✅ Usuário admin criado com sucesso (email: admin@test.com, senha: admin123)');

    // Since we deleted the database, we don't need to check for existing rooms

    // Criar rooms de teste
    const rooms = [
      {
        identifier: 101,
        type: 'hotelRoom',
        n_of_adults: 2,
        description: 'Quarto confortável com vista para o mar',
        cost: 250,
        photos: ['https://res.cloudinary.com/dajmzj1ww/image/upload/v1754170869/orla-copacabana-hotel_ebs788.jpg',
          'https://res.cloudinary.com/dajmzj1ww/image/upload/v1754170868/Hotel-Fasano-Rio-de-Janeiro_hhkbvt.jpg'],
        city: 'Rio de Janeiro',
        hotel_id: hotel1.id
      },
      {
        identifier: 102,
        type: 'lodge',
        n_of_adults: 3,
        description: 'Suite de luxo com vista para o mar',
        cost: 450,
        photos: ['https://res.cloudinary.com/dajmzj1ww/image/upload/v1754170867/download_xwzx6n.jpg',
          'https://res.cloudinary.com/dajmzj1ww/image/upload/v1754170866/miramar-hotel-by-windsor_bilqrt.jpg'],
        city: 'Rio de Janeiro',
        hotel_id: hotel1.id
      },
      {
        identifier: 202,
        type: 'lodge',
        n_of_adults: 4,
        description: 'Suite executiva com sala de estar',
        cost: 600,
        photos: ['https://res.cloudinary.com/dajmzj1ww/image/upload/v1754171234/RWSPO_Accomodations_PremierSuiteLivingRoom2_toukwn.webp'],
        city: 'São Paulo',
        hotel_id: hotel2.id
      },
      {
        identifier: 301,
        type: 'hotelRoom',
        n_of_adults: 2,
        description: 'Quarto elegante com design contemporâneo',
        cost: 280,
        photos: ['https://res.cloudinary.com/dajmzj1ww/image/upload/v1754171179/download_2_qthgqf.jpg'],
        city: 'São Paulo',
        hotel_id: hotel3.id
      },
      {
        identifier: 302,
        type: 'lodge',
        n_of_adults: 3,
        description: 'Suite de luxo com terraço privativo',
        cost: 520,
        photos: ['https://res.cloudinary.com/dajmzj1ww/image/upload/v1754171177/download_3_ng3b97.jpg'],
        city: 'São Paulo',
        hotel_id: hotel3.id
      }
    ];

    for (const room of rooms) {
      try {
        await Room.create(room);
        console.log(`✅ Room criado: ${room.identifier} - ${room.type} em ${room.city}`);
      } catch (error) {
        console.error(`❌ Erro ao criar room ${room.identifier}:`, error.message);
      }
    }

    console.log('🎉 Seed de rooms concluído!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro no seed:', error);
    process.exit(1);
  }
}

seedRooms(); 