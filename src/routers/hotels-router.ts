import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getHotels } from '@/controllers/hotel-controller';

const hotelsRouter = Router();

hotelsRouter.get('/', authenticateToken, getHotels);

export { hotelsRouter };