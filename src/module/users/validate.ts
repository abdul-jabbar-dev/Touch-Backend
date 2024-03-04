import { z } from "zod";

const createUserValidator = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email address" }),
  }),
});

export const updateUserValidator = z.object({
  body: z.object({
    fullName: z.string().optional(),
    profileImg: z.string().optional(),
    coverImg: z.string().optional(),
    phoneNumber: z.string().optional(),
    bio: z.string().optional(),
  }),
});

export const completeProfileValidator = z.object({
  body: z.object({
    fullName: z.string(),
    profileImg: z.string(),
    coverImg: z.string(),
    phoneNumber: z.string(),
    bio: z.string().optional(),
  }),
});
export default createUserValidator;
