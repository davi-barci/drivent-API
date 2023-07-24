import { AuthenticatedRequest } from '@/middlewares';
import { NextFunction, Response } from 'express';
import bookingService from '@/services/booking-service';
import httpStatus from 'http-status';

export async function getBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req;
    const booking = await bookingService.getBooking(userId);

    return res.status(httpStatus.OK).send({ id: booking.id, Room: booking.Room });
  } catch (error) {
    next(error);
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req;
    const { roomId } = req.body;

    const booking = await bookingService.postBooking(userId, roomId);

    return res.status(httpStatus.OK).send({ bookingId: booking.id });
  } catch (error) {
    next(error);
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response, next: NextFunction){
  try {
    const { userId } = req;
    const bookingId = Number(req.params.bookingId);
    if (!bookingId) return res.sendStatus(httpStatus.NOT_FOUND);

    const { roomId } = req.body;
    const booking = await bookingService.updateBooking(userId, roomId);

    return res.status(httpStatus.OK).send({ bookingId: booking.id });
  } catch (error) {
    next(error);
  }
}
