import { Prisma } from "@prisma/client";

export type IReqVerifyUser = Prisma.usersGetPayload<{include: { credentials: true }}>