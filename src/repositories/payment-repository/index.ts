import { prisma } from '@/config';

async function getTicketPayment(ticketId: number) {
    return prisma.payment.findFirst({
        where: {
            ticketId,
        },
    });
}

export default { getTicketPayment };