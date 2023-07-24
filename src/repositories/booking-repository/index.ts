import { prisma } from '@/config';
import { CreateBooking, UpdateBooking } from '@/protocols';

async function getBooking(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId: userId,
    },
    include: {
      Room: true,
    },
  });
}

async function postBooking({ roomId, userId }: CreateBooking) {
  return prisma.booking.create({
    data: {
      roomId: roomId,
      userId: userId,
    },
  });
}

async function getByRoomId(roomId: number) {
  return prisma.booking.findMany({
    where: {
      roomId: roomId,
    },
    include: {
      Room: true,
    },
  });
}

async function getRoom(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId,
    },
  });
}

async function getByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId: userId,
    },
    include: {
      Room: true,
    },
  });
}

async function updateBooking({ id, roomId, userId }: UpdateBooking) {
  return prisma.booking.upsert({
    where: {
      id: id,
    },
    create: {
      roomId: roomId,
      userId: userId,
    },
    update: {
      roomId: roomId,
    },
  });
}

export default { getBooking, postBooking, getByRoomId, getRoom, updateBooking, getByUserId };