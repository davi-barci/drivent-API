import app, { init } from "@/app";
import { cleanDb, generateValidToken } from "../helpers";
import supertest from "supertest";
import httpStatus from "http-status";
import faker from "@faker-js/faker";
import { createEnrollmentWithAddress, createHotel, createHotelRoom, createPayment, createTicket, createTicketType, createUser } from "../factories";
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
        const userToken = faker.lorem.word();
    
        const response = await server.get('/booking').set('Authorization', `Bearer ${userToken}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('401 - No valid session', async () => {
        const userWithoutSession = await createUser();
        const userToken = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.get('/booking').set('Authorization', `Bearer ${userToken}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('if valid token', () => {
        it('200 - get user booking', async () => {
            const user = await createUser();
            const userToken = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            await createPayment(ticket.id, ticketType.price);

            const hotel = await createHotel();
            const room = await createHotelRoom(hotel.id);
            const booking = await createBooking({ userId: user.id, roomId: room.id});

            const response = await server.get('/booking').set('Authorization', `Bearer ${userToken}`);

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
            const userToken = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            await createPayment(ticket.id, ticketType.price);

            const response = await server.get('/booking').set('Authorization', `Bearer ${userToken}`);
      
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });
    });
});

describe('POST /booking', () => {
    it('401 - No token', async () => {
        const response = await server.post('/booking').send({roomId: 1});
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('401 - No valid token', async () => {
        const userToken = faker.lorem.word();
        const response = await server.post('/booking').set('Authorization', `Bearer ${userToken}`).send({roomId: 1});
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('401 - No valid session', async () => {
        const userWithoutSession = await createUser();
        const userToken = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.post('/booking').set('Authorization', `Bearer ${userToken}`).send({roomId: 1});
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('if valid token', () => {
        it('200 - Valid room id', async () => {
            const user = await createUser();
            const userToken = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            await createPayment(ticket.id, ticketType.price);

            const hotel = await createHotel();
            const room = await createHotelRoom(hotel.id);
      
            const response = await server.post('/booking').set('Authorization', `Bearer ${userToken}`).send({roomId: room.id});
      
            expect(response.status).toEqual(httpStatus.OK);
        });

        it('404 - Not room id', async () => {
            const user = await createUser();
            const userToken = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            await createPayment(ticket.id, ticketType.price);
      
            const response = await server.post('/booking').set('Authorization', `Bearer ${userToken}`).send({});
      
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('403 - Not user enrollment', async () => {
            const user = await createUser();
            const userToken = await generateValidToken(user);
      
            const hotel = await createHotel();
            const room = await createHotelRoom(hotel.id);
      
            const response = await server.post('/booking').set('Authorization', `Bearer ${userToken}`).send({ roomId: room.id});
      
            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });

        it('403 - Not ticket enrollment', async () => {
            const user = await createUser();
            const otherUser = await createUser();
            const userToken = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(otherUser);
            const ticketType = await createTicketType(false, true);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      
            const hotel = await createHotel();
            const room = await createHotelRoom(hotel.id);
      
            const response = await server.post('/booking').set('Authorization', `Bearer ${userToken}`).send({ roomId: room.id});
      
            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });

        it('403 - Reserved ticket', async () => {
            const user = await createUser();
            const userToken = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      
            const hotel = await createHotel();
            const room = await createHotelRoom(hotel.id);
      
            const response = await server.post('/booking').set('Authorization', `Bearer ${userToken}`).send({ roomId: room.id});
      
            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });

        it('403 - Remote ticket', async () => {
            const user = await createUser();
            const userToken = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(true, true);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      
            const hotel = await createHotel();
            const room = await createHotelRoom(hotel.id);
      
            const response = await server.post('/booking').set('Authorization', `Bearer ${userToken}`).send({roomId: room.id});
      
            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });

        it('403 - Not includes hotel ticket', async () => {
            const user = await createUser();
            const userToken = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, false);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      
            const hotel = await createHotel();
            const room = await createHotelRoom(hotel.id);
      
            const response = await server.post('/booking').set('Authorization', `Bearer ${userToken}`).send({roomId: room.id});
      
            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });

        it('404 - Invalid room id', async () => {
            const user = await createUser();
            const userToken = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            await createPayment(ticket.id, ticketType.price);
      
            const response = await server.post('/booking').set('Authorization', `Bearer ${userToken}`).send({roomId: 0});
      
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('403 - Not vacancy', async () => {
            const user = await createUser();
            const userToken = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            await createPayment(ticket.id, ticketType.price);
      
            const hotel = await createHotel();
            const room = await createHotelRoom(hotel.id);

            await createBooking({userId: user.id, roomId: room.id});
            await createBooking({userId: user.id, roomId: room.id});
      
            const response = await server.post('/booking').set('Authorization', `Bearer ${userToken}`).send({roomId: room.id});
      
            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });
    });
});

describe('UPDATE /booking', () => {
    it('401 - No token', async () => {
        const response = await server.put('/booking/1').send({roomId: 1});
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('401 - No valid token', async () => {
        const userToken = faker.lorem.word();
        const response = await server.put('/booking/1').set('Authorization', `Bearer ${userToken}`).send({roomId: 1});
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('401 - No valid session', async () => {
        const userWithoutSession = await createUser();
        const userToken = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.put('/booking/1').set('Authorization', `Bearer ${userToken}`).send({roomId: 1});
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('if valid token', () => {
        it('200 - Valid room id', async () => {
            const user = await createUser();
            const userToken = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            await createPayment(ticket.id, ticketType.price);
      
            const hotel = await createHotel();
            const room = await createHotelRoom(hotel.id);
            const booking = await createBooking({roomId: room.id, userId: user.id});
            const newRoom = await createHotelRoom(hotel.id);
      
            const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${userToken}`).send({roomId: newRoom.id});
      
            expect(response.status).toEqual(httpStatus.OK);
        });

        it('404 - Not room id', async () => {
            const user = await createUser();
            const userToken = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            await createPayment(ticket.id, ticketType.price);
      
            const hotel = await createHotel();
            const room = await createHotelRoom(hotel.id);
            const booking = await createBooking({roomId: room.id, userId: user.id});

            const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${userToken}`).send({});
      
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('404 - Invalid room id', async () => {
            const user = await createUser();
            const userToken = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            await createPayment(ticket.id, ticketType.price);

            const hotel = await createHotel();
            const room = await createHotelRoom(hotel.id);
            const booking = await createBooking({roomId: room.id, userId: user.id});
      
            const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${userToken}`).send({roomId: 0});
      
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('403 - Not vacancy', async () => {
            const user = await createUser();
            const userToken = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            await createPayment(ticket.id, ticketType.price);
      
            const hotel = await createHotel();
            const currentRoom = await createHotelRoom(hotel.id);
            const booking = await createBooking({userId: user.id, roomId: currentRoom.id});
            await createBooking({userId: user.id, roomId: currentRoom.id});
            await createBooking({userId: user.id, roomId: currentRoom.id});
      
            const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${userToken}`).send({roomId: currentRoom.id});
      
            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });

        it('403 - Not user booking', async () => {
            const user = await createUser();
            const userToken = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            await createPayment(ticket.id, ticketType.price);
      
            const hotel = await createHotel();
            const room = await createHotelRoom(hotel.id);
      
            const otherUser = await createUser();
            const booking = await createBooking({userId: otherUser.id, roomId: room.id});
      
            const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${userToken}`).send({roomId: room.id});
      
            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });
    });
});
