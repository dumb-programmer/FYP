import { ObjectId } from "mongodb";
import { z } from "zod";

const SignupSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "firstName must be at least 1 characters long" })
    .max(100, { message: "firstName cannot be greater than 100 characters" }),
  lastName: z
    .string()
    .min(1, { message: "lastName must be at least 5 characters long" })
    .max(100, { message: "lastName cannot be greater than 100 characters" }),
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "password must be at least 8 characters long" }),
});

const LoginSchema = SignupSchema.omit({ firstName: true, lastName: true });

const ChatSchema = z.object({
  name: z
    .string()
    .min(5, { message: "name must be at least 5 characters long" }),
});

const QuerySchema = z.object({
  prompt: z
    .string()
    .min(10, { message: "prompt must be at least 10 character long" }),
});

const ChatIDSchema = z.object({
  chatId: z.string().refine(
    (value) => {
      return /^[0-9a-fA-F]{24}$/.test(value);
    },
    { message: "Invalid ObjectId" }
  ),
});

export {
  SignupSchema,
  LoginSchema,
  ChatSchema,
  QuerySchema,
  ChatIDSchema,
};
