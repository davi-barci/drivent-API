import ticketRepository from '@/repositories/ticket-repository';
import { notFoundError, unauthorizedError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import paymentRepository from '@/repositories/payment-repository';
import { PaymentDataCard } from '@/protocols';

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

async function postTicketPayment(ticketId: number, userId: number, cardData: PaymentDataCard) {
    const ticket = await ticketRepository.getTickeyById(ticketId);
    if (!ticket) throw notFoundError();

    const tickerEnrollment = await enrollmentRepository.getEnrollmentById(ticket.enrollmentId);
    if (!tickerEnrollment) throw notFoundError();

    if (tickerEnrollment.userId !== userId) throw unauthorizedError();

    const ticketType = await ticketRepository.getTicketTypeById(ticketId);

    const paymentData = {
        ticketId,
        value: ticketType.TicketType.price,
        cardIssuer: cardData.issuer,
        cardLastDigits: cardData.number.toString().slice(-4),
    };

    const payment = await paymentRepository.postTicketPayment(ticketId, paymentData);

    await ticketRepository.updateTicketPayment(ticketId);

    return payment;
}

export default { getTicketPayment, postTicketPayment };