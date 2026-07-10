import * as z from "zod";

const userInputSchema = z.strictObject({
  firstName: z
    .string({ message: "First name must be a string" })
    .min(1, { message: "First name is required" })
    .max(50, { message: "First name cannot exceed 50 characters" })
    .trim(),
  lastName: z
    .string({ message: "Last name must be a string" })
    .min(1, { message: "Last name is required" })
    .max(50, { message: "Last name cannot exceed 50 characters" })
    .trim(),
  email: z
    .string({ message: "Email must be a string" })
    .email({ message: "Email must be a valid email address" })
    .trim(),
});

export default userInputSchema;
