import { z } from "zod";
import { ValidationError } from "./validation.types";

// Helper for required string fields
const requiredString = (fieldName: string) =>
  z.preprocess(
    (value) => {
      if (value === undefined || value === null) {
        return ""; // force empty string to trigger custom message
      }
      return value;
    },
    z.string().nonempty(`${fieldName} is required`)
  );

// Helper for required ISO date strings
const requiredIsoDate = (fieldName: string) =>
  z.preprocess(
    (value) => {
      if (value === undefined || value === null) {
        return ""; // missing field
      }
      return value;
    },
    z
      .string()
      .nonempty(`${fieldName} is required`)
      .refine((val) => !isNaN(Date.parse(val)), {
        message: `${fieldName} must be a valid ISO date string`,
      })
  );

export const createReservationSchema = z.object({
  roomId: requiredString("roomId"),
  startTime: requiredIsoDate("startTime"),
  endTime: requiredIsoDate("endTime"),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;

export function validateCreateReservation(input: unknown): { data?: CreateReservationInput; errors?: ValidationError["details"] } {
  const result = createReservationSchema.safeParse(input);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    return { errors };
  }

  return { data: result.data };
}
