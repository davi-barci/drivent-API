import { prisma } from '@/config';

async function getHotels() {
    return prisma.hotel.findMany();
}

async function getHotelRoomsById(hotelId: number) {
    return prisma.hotel.findFirst({
        where: {
        id: hotelId,
        },
        include: {
        Rooms: true,
        },
    });
}

export default { getHotels, getHotelRoomsById };
