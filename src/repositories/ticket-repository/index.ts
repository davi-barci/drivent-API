import { prisma } from '@/config';
import { CreateTicket } from '@/protocols';

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

async function postNewTicket(ticket: CreateTicket) {
  return prisma.ticket.create({
    data: ticket,
  });
}

async function getTickeyById(ticketId: number) {
  return prisma.ticket.findFirst({
    where: {
      id: ticketId,
    }
  });
}

export default { getTicketTypes, getUserTicket, postNewTicket, getTickeyById };