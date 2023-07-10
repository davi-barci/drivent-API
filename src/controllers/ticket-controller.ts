import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import ticketService from '@/services/ticket-service';

export async function getTicketTypes(_req: AuthenticatedRequest, res: Response) {
    try {
      const ticketTypes = await ticketService.getTicketType();

      return res.status(httpStatus.OK).send(ticketTypes);
    } catch (error) {
      return res.sendStatus(httpStatus.NO_CONTENT);
    }
}