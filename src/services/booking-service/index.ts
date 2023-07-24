import bookingRepository from '@/repositories/booking-repository';
import { notFoundError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { forbiddenError } from '@/errors/forbidden-error';
import ticketRepository from '@/repositories/ticket-repository';

async function getBooking(userId: number) {
    const booking = await bookingRepository.getBooking(userId);
    if (!booking) throw notFoundError();

    return booking;
}

async function postBooking(userId: number, roomId: number) {
    if (!roomId) throw notFoundError();

    const userEnrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!userEnrollment) throw forbiddenError();

    const enrollmentTicket = await ticketRepository.getTicketByEnrollmentId(userEnrollment.id);
    if (!enrollmentTicket || enrollmentTicket.status === "RESERVED" || enrollmentTicket.TicketType.isRemote || !enrollmentTicket.TicketType.includesHotel) throw forbiddenError();

    const room = await bookingRepository.getRoom(roomId);
    const booking = await bookingRepository.getByRoomId(roomId);

    if (!room) throw notFoundError();
    if (room.capacity <= booking.length) throw forbiddenError();

    return bookingRepository.postBooking({ roomId, userId });
}

async function updateBooking(userId: number, roomId: number) {
    if (!roomId) throw notFoundError();

    const room = await bookingRepository.getRoom(roomId);
    const booking = await bookingRepository.getByRoomId(roomId);

    if (!room) throw notFoundError();
    if (room.capacity <= booking.length) throw forbiddenError();

    const userBooking = await bookingRepository.getByUserId(userId);
    if (!userBooking || userBooking.userId !== userId) throw forbiddenError();

    return bookingRepository.updateBooking({id: userBooking.id, roomId, userId});
}

export default { getBooking, postBooking, updateBooking };