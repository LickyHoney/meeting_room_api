import { reservations } from "../store/inMemoryStore";
import { Reservation } from "../models/reservation.model";
import { randomUUID } from "crypto";

export class ReservationService {
  static createReservation(
    roomId: string,
    startTime: Date,
    endTime: Date
  ): Reservation {
    const now = new Date();

    // Rule: start must be before end
    if (startTime >= endTime) {
      throw new Error("Start time must be before end time");
    }

    // Rule: cannot create in the past
    if (startTime < now) {
      throw new Error("Reservation cannot start in the past");
    }

    // Rule: no overlapping reservations for same room
    const overlapping = reservations.some(r =>
      r.roomId === roomId &&
      startTime < r.endTime &&
      endTime > r.startTime
    );

    if (overlapping) {
      throw new Error("Reservation overlaps with an existing one");
    }

    const reservation: Reservation = {
      id: randomUUID(),
      roomId,
      startTime,
      endTime
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
