import { z } from "zod";

// Helper to validate ISO date strings
const isoDateString = z
  .string()
  .nonempty("Date is required")
  .refine((value) => !isNaN(Date.parse(value)), {
    message: "Must be a valid ISO date string",
  });

export const createReservationSchema = z.object({
  roomId: z
    .string()
    .nonempty("roomId is required"),

  startTime: isoDateString,
  endTime: isoDateString,
});

// Strongly typed input
export type CreateReservationInput = z.infer<
  typeof createReservationSchema
>;
