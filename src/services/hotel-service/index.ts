import hotelRepository from '@/repositories/hotel-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepository from '@/repositories/ticket-repository';
import { notFoundError, paymentRequiredError, servicesError } from '@/errors';

async function getHotels(userId: number) {
    const userEnrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!userEnrollment) {
        throw notFoundError();
    }

    const ticket = await ticketRepository.getTicketByEnrollmentId(userEnrollment.id);
    if (!ticket) {
        throw notFoundError();
    }

    if (ticket.status !== 'PAID') {
        throw paymentRequiredError();
    }

    if (!ticket.TicketType.includesHotel || ticket.TicketType.isRemote) {
        throw servicesError();
    }

    const hotels = await hotelRepository.getHotels();
    if (!hotels || hotels.length === 0) {
        throw notFoundError();
    }
    return hotels;
}

async function getHotelsRooms(userId: number, hotelId: number) {
    const userEnrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!userEnrollment) {
        throw notFoundError();
    }

    const ticket = await ticketRepository.getTicketByEnrollmentId(userEnrollment.id);
    if (!ticket) {
        throw notFoundError();
    }

    if (ticket.status !== 'PAID') {
        throw paymentRequiredError();
    }

    if (!ticket.TicketType.includesHotel || ticket.TicketType.isRemote) {
        throw servicesError();
    }

    const hotel = await hotelRepository.getHotelRoomsById(hotelId);
    if (!hotel || hotel.Rooms.length === 0) {
        throw notFoundError();
    }
    return hotel;
}

export default {getHotels, getHotelsRooms};