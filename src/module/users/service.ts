import sendMailWithGmail from "../../connection/mail/Mail";
import OTPE_MAIL_UI from "../../connection/mail/OTPTemplete";
import prisma from "../../connection/prisma/prismaInstance";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt/JWT";

export const getAUserWithEmailDB = async ({ email }: { email: string }) => {
  const user = await prisma.users.findUnique({
    where: { email },
    include: { userInfo: true },
  });
  return user;
};

export const initUserDB = async ({ email }: { email: string }) => {
  const isExistEmail = await getAUserWithEmailDB({ email });
  // is email exist
  if (isExistEmail) {
    throw new Error("User Already exist");
  }

  const code = Math.floor(1000 + Math.random() * 9000);
  const codeExp = new Date(Date.now() + 5 * 60 * 1000);
  try {
    await prisma.$transaction(async (Tprisma) => {
      const user = await Tprisma.users.create({
        data: { email },
      });

      if (!user) {
        throw new Error("User registration failed");
      }

      const tokens = {
        accessToken: await generateAccessToken({
          accountStatus: "MakingUserName",
          id: user.id,
          userName: user.userName,
        }),
        refreshToken: await generateRefreshToken({
          accountStatus: "MakingUserName",
          id: user.id,
          userName: user.userName,
        }),
      };

      const userCradential = await Tprisma.credentials.create({
        data: {
          usersId: user.id,
          emailValidatorCode: code,
          emailValidatorCodeExp: codeExp,
          accountStatus: "MakingUserName",
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      });

      if (!userCradential) {
        throw new Error("Email validation code failed to generate");
      }

      const emailR = await sendMailWithGmail({
        html: OTPE_MAIL_UI({ code }),
        subject: "OTP Verification",
        text: "Please use the verification code below to sign in. " + code,
        to: email,
      });

      if (!userCradential) {
        throw new Error("OTP failed to generate");
      }
    });
  } catch (error) {
    throw error;
  }
};
