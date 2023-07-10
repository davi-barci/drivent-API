import { prisma } from '@/config';

async function getTicketTypes() {
    return prisma.ticketType.findMany();
}

export default { getTicketTypes };