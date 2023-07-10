import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getTicketTypes, getTicketByUser } from "@/controllers";


const ticketsRouter = Router();

ticketsRouter.get('/types', authenticateToken, getTicketTypes);
ticketsRouter.get('/', authenticateToken, getTicketByUser);

export { ticketsRouter };