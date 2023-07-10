import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getTicketPayment } from '@/controllers/payment-controller';

const paymentsRouter = Router();

paymentsRouter.get("/", authenticateToken, getTicketPayment);

export { paymentsRouter };