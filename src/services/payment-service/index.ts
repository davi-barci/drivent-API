import ticketRepository from '@/repositories/ticket-repository';
import { notFoundError, unauthorizedError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import paymentRepository from '@/repositories/payment-repository';

async function getTicketPayment(userId: number, ticketId: number) {
    const ticket = await ticketRepository.getTickeyById(ticketId);
    if (!ticket) throw notFoundError();

    const tickerEnrollment = await enrollmentRepository.getEnrollmentById(ticket.enrollmentId);
    if (!tickerEnrollment) throw notFoundError();

    if (tickerEnrollment.userId !== userId) throw unauthorizedError();

    const ticketPayment = await paymentRepository.getTicketPayment(ticketId);
    if (!ticketPayment) throw notFoundError();

    return ticketPayment;
}

export default { getTicketPayment };