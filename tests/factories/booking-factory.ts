import { prisma } from '@/config';
import { TicketStatus } from '@prisma/client';

export function createBooking({ roomId, userId }: { roomId: number, userId: number }) {
  return prisma.booking.create({
    data: {
      userId: userId,
      roomId: roomId,
    },
  });
};

export function getBookingReturn() {
  return {
    id: 1,
    userId: 1,
    roomId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    Room: {
      id: 1,
      name: '1999',
      capacity: 2,
      hotelId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };
};

export function userEnrollmentReturn(){
  return {
    id: 1,
    name: 'Davi Barci',
    cpf: '11111111111',
    birthday: new Date(),
    phone: '21999999999',
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    Address: [
      {
        id: 1,
        cep: '22222222',
        street: 'Rua dos bobos',
        city: 'Rio de Janeiro',
        state: 'RJ',
        number: '0',
        neighborhood: 'Tijuca',
        addressDetail: 'Casa',
        enrollmentId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  }
};

export function enrollmentTicketReturn(){
  return {
    id: 1,
    ticketTypeId: 1,
    enrollmentId: 1,
    status: TicketStatus.PAID,
    createdAt: new Date(),
    updatedAt: new Date(),
    TicketType: {
      id: 1,
      name: 'Hotel Ticket',
      price: 9999,
      isRemote: false,
      includesHotel: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };
};

export function bookingRoomReturn(){
  return {
    id: 1,
    name: '1999',
    capacity: 2,
    hotelId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export function getByRoomIdReturn(){
  return [
    {
      id: 1,
      userId: 1,
      roomId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Room: {
        id: 1,
        name: '1999',
        capacity: 2,
        hotelId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  ];
};

export function getByRoomIdNoVacancyReturn(){
  return [
    {
      id: 1,
      userId: 1,
      roomId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Room: {
        id: 1,
        name: '1999',
        capacity: 2,
        hotelId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    {
      id: 1,
      userId: 1,
      roomId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Room: {
        id: 1,
        name: '1999',
        capacity: 2,
        hotelId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }
  ];
}
