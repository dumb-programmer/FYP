import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

const validateQuery =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      const zodErrors = parsed.error.flatten().fieldErrors;
      for (const [field, messages] of Object.entries(zodErrors)) {
        if (messages?.length) {
          errors[field] = messages[0];
        }
      }
      return res.status(400).json({ errors });
    }
    next();
  };

export default validateQuery;
