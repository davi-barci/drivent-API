import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getBooking } from '@/controllers';

const bookingRouter = Router();

bookingRouter.get('/', authenticateToken, getBooking);

export { bookingRouter };