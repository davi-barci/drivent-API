import bookingRepository from "@/repositories/booking-repository";
import bookingService from "@/services/booking-service";
import { bookingRoomReturn, enrollmentTicketReturn, getBookingReturn, getByRoomIdNoVacancyReturn, getByRoomIdReturn, userEnrollmentReturn } from "../factories/booking-factory";
import { notFoundError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { forbiddenError } from "@/errors/forbidden-error";

describe('getBooking function', () => {
    it('Return user booking', async () => {
        const userId = 1;
        const booking = getBookingReturn();
    
        jest.spyOn(bookingRepository, 'getBooking').mockResolvedValue(booking);
    
        const result = await bookingService.getBooking(userId);
    
        expect(bookingRepository.getBooking).toHaveBeenCalledWith(userId);
        expect(result).toEqual(booking);
    });
    
    it('404 - Not found user booking', async () => {
        const userId = 1;
    
        jest.spyOn(bookingRepository, 'getBooking').mockResolvedValue(null);
    
        await expect(bookingService.getBooking(userId)).rejects.toEqual(notFoundError());
        expect(bookingRepository.getBooking).toHaveBeenCalledWith(userId);
    });
});

describe('postBooking function', () => {
    it('Create user booking', async () => {
        const userId = 1;
        const roomId = 1;
        const booking = getBookingReturn();
    
        jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue(userEnrollmentReturn());
        jest.spyOn(ticketRepository, 'getTicketByEnrollmentId').mockResolvedValue(enrollmentTicketReturn());
        jest.spyOn(bookingRepository, 'getRoom').mockResolvedValue(bookingRoomReturn());
        jest.spyOn(bookingRepository, 'getByRoomId').mockResolvedValue((getByRoomIdReturn()));
    
        jest.spyOn(bookingRepository, 'postBooking').mockResolvedValue(booking);
    
        const result = await bookingService.postBooking(userId, roomId);
    
        expect(bookingRepository.postBooking).toHaveBeenCalledWith({ userId, roomId });
        expect(result).toEqual(booking);
    });
  
    it('404 - Not room id', async () => {
        const userId = 1;
        const booking = getBookingReturn();

        await expect(bookingService.postBooking(userId, undefined)).rejects.toEqual(notFoundError());
    });

    it('403 - Not user enrollment', async () => {
        const userId = 1;
        const roomId = 1;
        const booking = getBookingReturn();
    
        jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue(undefined);

        await expect(bookingService.postBooking(userId, roomId)).rejects.toEqual(forbiddenError());
    });

    it('403 - Not enrollment ticket', async () => {
        const userId = 1;
        const roomId = 1;
        const booking = getBookingReturn();
    
        jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue(userEnrollmentReturn());
        jest.spyOn(ticketRepository, 'getTicketByEnrollmentId').mockResolvedValue(undefined);

        await expect(bookingService.postBooking(userId, roomId)).rejects.toEqual(forbiddenError());
    });

    it('404 - Not valid room id', async () => {
        const userId = 1;
        const roomId = 0;
        const booking = getBookingReturn();
    
        jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue(userEnrollmentReturn());
        jest.spyOn(ticketRepository, 'getTicketByEnrollmentId').mockResolvedValue(enrollmentTicketReturn());
        jest.spyOn(bookingRepository, 'getRoom').mockResolvedValue(undefined);
        jest.spyOn(bookingRepository, 'getByRoomId').mockResolvedValue(getByRoomIdReturn());

        await expect(bookingService.postBooking(userId, roomId)).rejects.toEqual(notFoundError());
    });

    it('403 - Not vacancy', async () => {
        const userId = 1;
        const roomId = 1;
        const booking = getBookingReturn();
    
        jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue(userEnrollmentReturn());
        jest.spyOn(ticketRepository, 'getTicketByEnrollmentId').mockResolvedValue(enrollmentTicketReturn());
        jest.spyOn(bookingRepository, 'getRoom').mockResolvedValue(bookingRoomReturn());
        jest.spyOn(bookingRepository, 'getByRoomId').mockResolvedValue((getByRoomIdNoVacancyReturn()));

        await expect(bookingService.postBooking(userId, roomId)).rejects.toEqual(forbiddenError());
    });
});

describe('updateBooking function', () => {
    it('Update user booking', async () => {
        const userId = 1;
        const roomId = 1;
        const booking = getBookingReturn();
    
        jest.spyOn(bookingRepository, 'getRoom').mockResolvedValue((bookingRoomReturn()));
        jest.spyOn(bookingRepository, 'getByRoomId').mockResolvedValue(getByRoomIdReturn());
        jest.spyOn(bookingRepository, 'getByUserId').mockResolvedValue(booking);
        jest.spyOn(bookingRepository, 'updateBooking').mockResolvedValue(booking);
    
        const result = await bookingService.updateBooking(userId, roomId);
        expect(result).toEqual(booking);
    });

    it('404 - Not room id', async () => {
        const userId = 1;
        const booking = getBookingReturn();

        await expect(bookingService.updateBooking(userId, undefined)).rejects.toEqual(notFoundError());
    });

    it('404 - Not valid room id', async () => {
        const userId = 1;
        const roomId = 1;
        const booking = getBookingReturn();
    
        jest.spyOn(bookingRepository, 'getRoom').mockResolvedValue(undefined);
        jest.spyOn(bookingRepository, 'getByRoomId').mockResolvedValue(getByRoomIdReturn());

        await expect(bookingService.updateBooking(userId, roomId)).rejects.toEqual(notFoundError());
    });

    it('403 - Not vacancy', async () => {
        const userId = 1;
        const roomId = 1;
        const booking = getBookingReturn();
    
        jest.spyOn(bookingRepository, 'getRoom').mockResolvedValue((bookingRoomReturn()));
        jest.spyOn(bookingRepository, 'getByRoomId').mockResolvedValue((getByRoomIdNoVacancyReturn()));

        await expect(bookingService.updateBooking(userId, roomId)).rejects.toEqual(forbiddenError());
    });

    it('403 - Not user booking', async () => {
        const userId = 1;
        const roomId = 1;
        const booking = getBookingReturn();
    
        jest.spyOn(bookingRepository, 'getRoom').mockResolvedValue((bookingRoomReturn()));
        jest.spyOn(bookingRepository, 'getByRoomId').mockResolvedValue(getByRoomIdReturn());
        jest.spyOn(bookingRepository, 'getByUserId').mockResolvedValue(undefined);
    
        await expect(bookingService.updateBooking(userId, roomId)).rejects.toEqual(forbiddenError());
    });
});
