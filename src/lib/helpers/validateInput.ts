import { Request, Response } from "express";
import { z } from "zod";

const inputObj = z.object({
  email: z
    .string()
    .email({ message: "invalid email syntax" })
    .nullable()
    .optional(),
  phoneNumber: z
    .string()
    .regex(/^\d*$/, { message: "Phone number should only contain digits" })
    .nullable()
    .optional(),
});

export function validateInput(
  req: Request,
  res: Response
): { email: string; phoneNumber: string } | null {
  const reqBody = req.body;
  //emai and  phone both cannot be null
  if (!reqBody.email && !reqBody.phoneNumber) {
    res.status(400).json({
      success: false,
      message: "either email or PhoneNumber must be provided",
    });
    return null;
  }

  // parsing input
  const parsedInput = inputObj.safeParse(reqBody);

  if (!parsedInput.success) {
    res.status(400).json({
      success: false,
      message: parsedInput.error.formErrors.fieldErrors,
    });
    return null;
  }

  const { email, phoneNumber } = parsedInput.data;

  return { email, phoneNumber } as { email: string; phoneNumber: string };
}
