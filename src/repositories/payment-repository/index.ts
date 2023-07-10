import { prisma } from '@/config';
import { CreatePayment } from '@/protocols';

async function getTicketPayment(ticketId: number) {
    return prisma.payment.findFirst({
        where: {
            ticketId,
        },
    });
}

async function postTicketPayment(ticketId: number, paymentValues: CreatePayment) {
    return prisma.payment.create({
        data: {
            ticketId,
            ...paymentValues,
        },
    });
}

export default { getTicketPayment, postTicketPayment };