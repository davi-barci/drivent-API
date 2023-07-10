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

export async function getTicketByUser(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const ticket = await ticketService.getTicketByUser(userId);

    return res.status(httpStatus.OK).send(ticket);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function postNewTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketTypeId } = req.body; 

  if (!ticketTypeId) return res.sendStatus(httpStatus.BAD_REQUEST);

  try {
    const ticket = await ticketService.postNewTicket(userId, ticketTypeId);

    return res.status(httpStatus.CREATED).send(ticket);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}