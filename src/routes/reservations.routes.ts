import { Router } from "express";
import { ReservationService } from "../services/reservations.service";

const router = Router();

router.post("/reservations", (req, res) => {
  try {
    // Directly pass the request body to the service
    const reservation = ReservationService.createReservation(req.body);
    res.status(201).json(reservation);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/reservations/:id", (req, res) => {
  try {
    ReservationService.cancelReservation(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

router.get("/rooms/:roomId/reservations", (req, res) => {
  const data = ReservationService.listReservationsForRoom(req.params.roomId);
  res.json(data);
});

export default router;
