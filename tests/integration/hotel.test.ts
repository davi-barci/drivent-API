import httpStatus from "http-status";
import faker from "@faker-js/faker";
import app, { init } from '@/app';
import { cleanDb, generateValidToken } from "../helpers";
import supertest from "supertest";
import { createEnrollmentWithAddress, createHotel, createPayment, createTicket, createTicketType, createUser } from "../factories";
import { TicketStatus } from "@prisma/client";

beforeAll(async () => {
    await init();
    await cleanDb();
})

beforeEach(async () => {
    await cleanDb();
})

const server = supertest(app);

describe('/GET hotels', () => {
    it('401 - No token', async () => {
        const response = await server.get('/hotels');
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('401 - No valid token', async () => {
        const userToken = faker.lorem.word();
        const response = await server.get('/hotels').set('Authorization', `Bearer ${userToken}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    })

    describe('if valid token', () => {
        it('200 - get hotels', async () => {
            const user = await createUser();
            const userToken = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, ticketType.price);
      
            const hotel = await createHotel();
            const response = await server.get('/hotels').set('Authorization', `Bearer ${userToken}`);
      
            expect(response.status).toEqual(httpStatus.OK);
      
            expect(response.body).toEqual([
              {
                id: hotel.id,
                name: hotel.name,
                image: hotel.image,
                createdAt: hotel.createdAt.toISOString(),
                updatedAt: hotel.updatedAt.toISOString(),
              },
            ]);
        });

        it('200 - Empty array', async () => {
            const user = await createUser();
            const userToken = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, ticketType.price);
      
            const response = await server.get('/hotels').set('Authorization', `Bearer ${userToken}`);
      
            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual([]);
        });

        it('402 - Remote user ticket', async () => {
            const user = await createUser();
            const userToken = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(true);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      
            const response = await server.get('/hotels').set('Authorization', `Bearer ${userToken}`);
      
            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        });

        it('404 - No user enrollment ', async () => {
            const user = await createUser();
            const userToken = await generateValidToken(user);
      
            const response = await server.get('/hotels').set('Authorization', `Bearer ${userToken}`);
      
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });
    });
});