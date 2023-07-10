import { prisma } from '@/config';
import { CreateTicket } from '@/protocols';
import { TicketStatus } from '@prisma/client';

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

async function getTicketTypeById(ticketId: number) {
  return prisma.ticket.findFirst({
    where: {
      id: ticketId,
    },
    include: {
      TicketType: true,
    },
  });
}

async function updateTicketPayment(ticketId: number) {
  return prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status: TicketStatus.PAID,
    },
  });
}

export default { getTicketTypes, getUserTicket, postNewTicket, getTickeyById, getTicketTypeById, updateTicketPayment };