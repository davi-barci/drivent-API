import { AuthenticatedRequest } from '@/middlewares';
import { NextFunction, Response } from 'express';
import bookingService from '@/services/booking-service';
import httpStatus from 'http-status';

export async function getBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { userId } = req;
      const booking = await bookingService.getBooking(userId);

      return res.status(httpStatus.OK).send({
        id: booking.id,
        Room: booking.Room,
      });
    } catch (error) {
      next(error);
    }
}