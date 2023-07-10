import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getTicketTypes, getTicketByUser, postNewTicket } from "@/controllers";


const ticketsRouter = Router();

ticketsRouter.get('/types', authenticateToken, getTicketTypes);
ticketsRouter.get('/', authenticateToken, getTicketByUser);
ticketsRouter.post('/', authenticateToken, postNewTicket);

export { ticketsRouter };