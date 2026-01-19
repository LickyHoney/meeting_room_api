import { reservations } from "../store/inMemoryStore";
import { Reservation } from "../models/reservation.model";
import { randomUUID } from "crypto";
import { createReservationSchema, CreateReservationInput, validateCreateReservation } from "../validation/reservation.validation";
import { ValidationError } from "../validation/validation.types";

export class ReservationService {
  static createReservation(input: CreateReservationInput): Reservation {
    const { data, errors } = validateCreateReservation(input);
    if (errors) {
      throw {
        type: "validation",
        details: errors,
      } as ValidationError; // explicitly typed
    }
    if (!data) {
      throw new Error("Validation data is missing");
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
