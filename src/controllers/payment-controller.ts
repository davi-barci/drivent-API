import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import paymentService from '@/services/payment-service';

export async function getTicketPayment(req: AuthenticatedRequest, res: Response) {
    try {
        const ticketId = Number(req.query.ticketId);
        const { userId } = req;

        if (!ticketId) return res.sendStatus(httpStatus.BAD_REQUEST);

        const tickerPayment = await paymentService.getTicketPayment(userId, ticketId);
        if (!tickerPayment) return res.sendStatus(httpStatus.NOT_FOUND);

        return res.status(httpStatus.OK).send(tickerPayment);
    } catch (error) {
        if (error.name === 'UnauthorizedError') {
            return res.sendStatus(httpStatus.UNAUTHORIZED);
        }
        return res.sendStatus(httpStatus.NOT_FOUND);
    }
}

export async function postTicketPayment(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { ticketId, cardData } = req.body;

    try {
        if (!ticketId || !cardData) return res.sendStatus(httpStatus.BAD_REQUEST);

        const ticketPayment = await paymentService.postTicketPayment(ticketId, userId, cardData);
        if (!ticketPayment) return res.sendStatus(httpStatus.NOT_FOUND);

        return res.status(httpStatus.OK).send(ticketPayment);
    } catch (error) {
        if (error.name === 'UnauthorizedError') {
            return res.sendStatus(httpStatus.UNAUTHORIZED);
        }
        return res.sendStatus(httpStatus.NOT_FOUND);
    }
}

