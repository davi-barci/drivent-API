import { prisma } from '@/config';
import { CreateBooking } from '@/protocols';

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

export default { getBooking, postBooking, getByRoomId, getRoom };