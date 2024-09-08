import { isValidObjectId } from "mongoose";
import { z } from "zod";

export const SignupSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "firstName must be at least 1 character long" })
    .max(100, { message: "firstName cannot be greater than 100 characters" }),
  lastName: z
    .string()
    .min(1, { message: "lastName must be at least 1 character long" })
    .max(100, { message: "lastName cannot be greater than 100 characters" }),
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "password must be at least 8 characters long" }),
});

export const LoginSchema = SignupSchema.omit({
  firstName: true,
  lastName: true,
});

export const ChatSchema = z.object({
  name: z
    .string()
    .min(1, { message: "name must be at least 1 character long" })
    .max(100, { message: "name cannot be greater than 100 characters" }),
});

export const QuerySchema = z.object({
  prompt: z
    .string()
    .min(10, { message: "prompt must be at least 10 character long" }),
});

export const ChatIDSchema = z.object({
  chatId: z.string().refine(
    (value) => {
      return isValidObjectId(value);
    },
    { message: "Invalid ObjectId" }
  ),
});

export const PaginatedQuerySchema = z.object({
  page: z
    .string()
    .refine(
      (value) => {
        if (+value > 0) {
          return true;
        }
        return false;
      },
      { message: "page must be a number greater than 0" }
    )
    .optional(),
});

export const FeedbackSchema = z.object({
  type: z.enum(["positive", "negative"]),
  comments: z.string().max(500, "comments cannot be greater than 500 characters"),
  category: z.string(),
  messageId: z.string().refine(val => isValidObjectId(val))
}).superRefine((data, ctx) => {
  const { type, category } = data;

  const validCategories = {
    positive: ["correct", "easy-to-understand", "complete", "other"],
    negative: ["offensive/unsafe", "not-factually-correct", "other"],
  };

  if (!validCategories[type]?.includes(category)) {
    ctx.addIssue({
      path: ['category'],
      message: `Invalid category "${category}" for type "${type}".`,
      code: z.ZodIssueCode.custom,
    });
  }
});

export const UserIdSchema = z.object({
  userId: z.string().refine(val => isValidObjectId(val), { message: "Invalid ObjectId" })
})