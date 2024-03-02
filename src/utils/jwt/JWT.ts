import jwt from "jsonwebtoken";
import IJwtData from "../../interface/utils/jwt/T_JWT";
import ENV from "../../config";
export const generateAccessToken = async (data: IJwtData) => {
  try {
    const token = await jwt.sign(data, ENV.JWT_SECRET as string, {
      expiresIn: ENV.JWT_TOKEN_EXP.ACCESS_TOKEN_EXP,
    });
    return token;
  } catch (error) {
    throw error;
  }
};

export const generateRefreshToken = async (data: IJwtData) => {
  try {
    const token = await jwt.sign(data, ENV.JWT_SECRET as string, {
      expiresIn: ENV.JWT_TOKEN_EXP.REFRESH_TOKEN_EXP,
    });
    return token;
  } catch (error) {
    throw error;
  }
};

export const decodeToken = async (token: string) => {
  try {
    if (token.includes("RefreshToken=" || "AccessToken=")) { 
      token = token.split("Token=")[1];
    }
    const res: string | jwt.JwtPayload | null = await jwt.decode(token);
    if (!res || typeof res === "string") {
      throw Error("Invalid token");
    }
    return res;
  } catch (error) {
    throw error;
  }
};
