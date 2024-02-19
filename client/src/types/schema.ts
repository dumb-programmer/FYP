import { z } from "zod";

export const SignupSchema = z
  .object({
    email: z.string().email(),
    firstName: z
      .string()
      .min(1, { message: "First name must be at least 1 character" })
      .max(100, { message: "First name must be less than 100 characters" }),
    lastName: z
      .string()
      .min(1, { message: "Last name must be atleast 1 character" })
      .max(100, { message: "Last name must be less than 100 character" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Confirm password must be at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
