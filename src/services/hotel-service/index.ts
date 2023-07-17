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
    if (!hotels) {
        throw notFoundError();
    }
    return hotels;
}

export default {getHotels};