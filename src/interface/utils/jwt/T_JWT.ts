import { AccountStatus } from "@prisma/client";

interface IJwtData {
  id: string;
  userName: string;
  accountStatus: AccountStatus;
}
export default IJwtData;
