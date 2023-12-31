import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getBooking, postBooking, updateBooking } from '@/controllers';

const bookingRouter = Router();

bookingRouter.get('/', authenticateToken, getBooking);
bookingRouter.post('/', authenticateToken, postBooking);
bookingRouter.put('/:bookingId', authenticateToken, updateBooking);

export { bookingRouter };