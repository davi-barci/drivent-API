import { notFoundError } from '@/errors';
import ticketRepository from '@/repositories/ticket-repository';

async function getTicketType() {
    const ticketTypes = await ticketRepository.getTicketTypes();
    
    if (!ticketTypes) throw notFoundError();
    return ticketTypes;
}

export default {getTicketType};