import app, { init } from "@/app";
import { cleanDb, generateValidToken } from "../helpers";
import supertest from "supertest";
import httpStatus from "http-status";
import faker from "@faker-js/faker";
import { createEnrollmentWithAddress, createHotel, createHotelRoom, createPayment, createTicket, createTicketTypeWithHotel, createUser } from "../factories";
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from "@prisma/client";
import { createBooking } from "../factories/booking-factory";

beforeAll(async () => {
    await init();
    await cleanDb();
})

beforeEach(async () => {
    await cleanDb();
})

const server = supertest(app);

describe('GET /booking', () => {
    it('401 - No token', async () => {
        const response = await server.get('/booking');
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('401 - No valid token', async () => {
        const token = faker.lorem.word();
    
        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('401 - No valid session', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('if valid token', () => {
        it('200 - get user booking', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            await createPayment(ticket.id, ticketType.price);

            const hotel = await createHotel();
            const room = await createHotelRoom(hotel.id);
            const booking = await createBooking({ userId: user.id, roomId: room.id});

            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual({
                id: booking.id,
                Room: {
                  id: expect.any(Number),
                  name: expect.any(String),
                  capacity: expect.any(Number),
                  hotelId: expect.any(Number),
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                },
            });
        });

        it('404 - Not found user booking', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            await createPayment(ticket.id, ticketType.price);
      
            const hotel = await createHotel();
            const room = await createHotelRoom(hotel.id);
      
            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });
    });
});