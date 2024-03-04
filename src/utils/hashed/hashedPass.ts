import b from "bcrypt";
import ENV from "../../config";
export const hashedPassword = async (pass: string) => {
  try {
    const hashed = await b.hash(pass, ENV.SALT!);
    return hashed;
  } catch (error) {
    throw error;
  }
};
export const comparePassword = async ({
  hashed,
  plain,
}: {
  hashed: string;
  plain: string;
}) => {
  try { 
    return await b.compare(plain, hashed);
  } catch (error) {
    throw error;
  }
};
