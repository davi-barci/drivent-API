import httpStatus from 'http-status';
import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import hotelService from '@/services/hotel-service';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
  
    try {
      const hotels = await hotelService.getHotels(Number(userId));

      return res.status(httpStatus.OK).send(hotels);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.sendStatus(httpStatus.NOT_FOUND);
      }

      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
}

export async function getHotelsRooms(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { hotelId } = req.params;

  try {
    const hotels = await hotelService.getHotelsRooms(Number(userId), Number(hotelId));

    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === 'PaymentRequiredError' || error.name === 'ServicesError') {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
