import { reservations } from "../store/inMemoryStore";
import { Reservation } from "../models/reservation.model";
import { randomUUID } from "crypto";
import { createReservationSchema, CreateReservationInput, validateCreateReservation } from "../validation/reservation.validation";

export class ReservationService {
  static createReservation(input: CreateReservationInput): Reservation {
    // Validate input using Zod
    // const parsed = createReservationSchema.safeParse(input);
    // if (!parsed.success) {
    //   // Return first validation error message for simplicity
    //   throw new Error(parsed.error.issues[0].message);
    // }
    const { data, errors } = validateCreateReservation(input);
    if (errors) {
      // Throw the errors so the route can handle them
      throw { type: "validation", details: errors };
    }
    const { roomId, startTime, endTime } = data;
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    // Rule: start must be before end
    if (start >= end) {
      throw new Error("Start time must be before end time");
    }

    // Rule: cannot create in the past
    if (start < now) {
      throw new Error("Reservation cannot start in the past");
    }

    // Rule: no overlapping reservations for same room
    const overlapping = reservations.some(r =>
      r.roomId === roomId &&
      start < r.endTime &&
      end > r.startTime
    );

    if (overlapping) {
      throw new Error("Reservation overlaps with an existing one");
    }

    const reservation: Reservation = {
      id: randomUUID(),
      roomId,
      startTime: start,
      endTime: end
    };

    reservations.push(reservation);
    return reservation;
  }

  static cancelReservation(id: string): void {
    const index = reservations.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error("Reservation not found");
    }
    reservations.splice(index, 1);
  }

  static listReservationsForRoom(roomId: string): Reservation[] {
    return reservations.filter(r => r.roomId === roomId);
  }
}
