import { z } from "zod";

const createUserValidator = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email address" }),
    fullName:z.string()
  }),
});
export default createUserValidator;
