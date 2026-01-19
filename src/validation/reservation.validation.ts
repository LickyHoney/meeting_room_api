import { z } from "zod";

// Define a Zod schema for reservation creation
export const createReservationSchema = z.object({
  roomId: z.string({
    required_error: "roomId is required",
    invalid_type_error: "roomId must be a string",
  }).min(1, "roomId cannot be empty"),

  startTime: z.string({
    required_error: "startTime is required",
    invalid_type_error: "startTime must be a string in ISO format",
  }).refine(val => !isNaN(Date.parse(val)), {
    message: "startTime must be a valid ISO date string",
  }),

  endTime: z.string({
    required_error: "endTime is required",
    invalid_type_error: "endTime must be a string in ISO format",
  }).refine(val => !isNaN(Date.parse(val)), {
    message: "endTime must be a valid ISO date string",
  }),
});

// TypeScript type for validated input
export type CreateReservationInput = z.infer<typeof createReservationSchema>;
