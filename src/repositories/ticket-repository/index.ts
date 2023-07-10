import { prisma } from '@/config';

async function getTicketTypes() {
    return prisma.ticketType.findMany();
}

async function getUserTicket(id: number) {
    return prisma.ticket.findFirst({
      where: { enrollmentId: id },
      include: {
        TicketType: true
      },
    });
}

export default { getTicketTypes, getUserTicket };