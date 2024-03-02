import { AccountStatus } from "@prisma/client";
import sendMailWithGmail from "../../connection/mail/Mail";
import OTP_MAIL_UI from "../../connection/mail/OTPTemplete";
import prisma from "../../connection/prisma/prismaInstance";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt/JWT";
import generateUserName from "../../utils/common/generateUserName";

export const getAUserWithEmailDB = async ({ email }: { email: string }) => {
  const user = await prisma.users.findUnique({
    where: { email },
    include: { userInfo: true },
  });
  return user;
};

export const getAUserWithUserNameDB = async ({
  userName,
}: {
  userName: string;
}) => {
  const user = await prisma.users.findUnique({
    where: { userName },
  });
  return user;
};

export const initUserDB = async ({ email }: { email: string }) => {
  const isExistEmail = await getAUserWithEmailDB({ email });
  // is email exist
  if (isExistEmail) {
    throw new Error("User Already exist");
  }
  let sendRes: {
    user: {
      userId: string;
      email: string;
      userName: string;
    };
    credentials: {
      accountStatus: AccountStatus;
      accessToken: string | null;
      refreshToken: string | null;
    };
  } | null;
  const code = Math.floor(1000 + Math.random() * 9000);
  const codeExp = new Date(Date.now() + 5 * 60 * 1000);
  try {
    await prisma.$transaction(async (AsyncPrisma) => {
      const emailToUserName = await generateUserName(email.split("@")[0]);
      if (!emailToUserName) {
        throw new Error("Invalid Create Username");
      }
      const user = await AsyncPrisma.users.create({
        data: { email, userName: emailToUserName },
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

      const userCredential = await AsyncPrisma.credentials.create({
        data: {
          usersId: user.id,
          emailValidatorCode: code,
          emailValidatorCodeExp: codeExp,
          accountStatus: "MakingUserName",
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      });

      if (!userCredential) {
        throw new Error("Email validation code failed to generate");
      }

      const emailR = await sendMailWithGmail({
        html: OTP_MAIL_UI({ code }),
        subject: "OTP Verification",
        text: "Please use the verification code below to sign in. " + code,
        to: email,
      });

      if (!userCredential) {
        throw new Error("OTP failed to generate");
      }
      sendRes = {
        user: { userId: user.id, email: user.email, userName: user.userName },
        credentials: {
          accountStatus: userCredential.accountStatus,
          accessToken: userCredential.accessToken,
          refreshToken: userCredential.refreshToken,
        },
      };
    });
    if (sendRes!) {
      return sendRes;
    } else {
      throw new Error("Registration failed");
    }
  } catch (error) {
    throw error;
  }
};
