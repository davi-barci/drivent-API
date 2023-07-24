import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getHotels, getHotelsRooms } from '@/controllers/hotel-controller';

const hotelsRouter = Router();

hotelsRouter.get('/', authenticateToken, getHotels);
hotelsRouter.get('/:hotelId', authenticateToken, getHotelsRooms);

export { hotelsRouter };
