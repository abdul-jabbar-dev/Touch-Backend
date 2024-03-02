import { Prisma } from "@prisma/client";
 

// to make the file a module and avoid the TypeScript error
export {};

declare global {
  namespace Express {
    export interface Request {
      authUser?: Prisma.usersGetPayload<{
        include: { credentials: true };
      }> | null;
    }
  }
}
