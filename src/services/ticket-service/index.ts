import { notFoundError } from '@/errors';
import ticketRepository from '@/repositories/ticket-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';

async function getTicketType() {
    const ticketTypes = await ticketRepository.getTicketTypes();
    
    if (!ticketTypes) throw notFoundError();
    return ticketTypes;
}

async function getTicketByUser(userId: number) {
    const enrollmentResult = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollmentResult) throw notFoundError();
  
    const ticket = await ticketRepository.getUserTicket(enrollmentResult.id);
    if (!ticket) throw notFoundError();
  
    return ticket;
}

export default {getTicketType, getTicketByUser};