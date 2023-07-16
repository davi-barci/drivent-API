import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getTicketPayment, postTicketPayment } from '@/controllers';

const paymentsRouter = Router();

paymentsRouter.get("/", authenticateToken, getTicketPayment);
paymentsRouter.post("/process", authenticateToken, postTicketPayment);

export { paymentsRouter };
