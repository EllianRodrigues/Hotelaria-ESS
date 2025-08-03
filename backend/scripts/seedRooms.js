// Script para adicionar dados de teste de rooms
import db from '../src/sqlite/db.js';
import Hotel from '../src/models/hotel.js';
import Room from '../src/models/room.js';

async function seedRooms() {
  try {
    console.log('🌱 Iniciando seed de rooms...');

    // Verificar se já existem hotéis de teste
    const existingHotels = await Hotel.getAll();
    let hotel1, hotel2, hotel3;

    if (existingHotels.length === 0) {
      // Criar hotéis de teste com emails únicos
      hotel1 = await Hotel.create('Hotel Copacabana Palace', 'Rio de Janeiro', '12345678901234', 'hotel1@seed.com', 'password123');
      hotel2 = await Hotel.create('Hotel Fasano', 'São Paulo', '98765432109876', 'hotel2@seed.com', 'password123');
      hotel3 = await Hotel.create('Hotel Unique', 'São Paulo', '11111111111111', 'hotel3@seed.com', 'password123');
      console.log('✅ Hotéis criados:', hotel1.id, hotel2.id, hotel3.id);
    } else {
      // Usar hotéis existentes
      hotel1 = existingHotels[0];
      hotel2 = existingHotels[1] || hotel1;
      hotel3 = existingHotels[2] || hotel1;
      console.log('✅ Usando hotéis existentes:', hotel1.id, hotel2.id, hotel3.id);
    }

    // Verificar se já existem rooms
    const existingRooms = await Room.getAll();
    if (existingRooms.length > 0) {
      console.log('⚠️ Rooms já existem no banco. Pulando criação...');
      console.log('🎉 Seed de rooms concluído!');
      process.exit(0);
    }

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