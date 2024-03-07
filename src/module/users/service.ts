import prisma from "../../connection/prisma/prismaInstance";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt/JWT";
import generateUserName from "../../utils/common/generateUserName";
import { AccountStatus, userInfos, users } from "@prisma/client";
import { IReqVerifyUser } from "../../interface/utils/req/IReqVerifyUser";
import moment, { now } from "moment";
import { generateOTPCode, sendOTP } from "../../func/sendOTP";
import { comparePassword, hashedPassword } from "../../utils/hashed/hashedPass";
import ILogin from "../../interface/user/IUserLogin";

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
  const codeExp = new Date(Date.now() + 5 * 60 * 1000);
  try {
    const code = generateOTPCode();
    await prisma.$transaction(async (AsyncPrisma: any) => {
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
          accountStatus: "Verifying",
          id: user.id,
          userName: user.userName,
        }),
        refreshToken: await generateRefreshToken({
          accountStatus: "Verifying",
          id: user.id,
          userName: user.userName,
        }),
      };

      const userCredential = await AsyncPrisma.credentials.create({
        data: {
          usersId: user.id,
          emailValidatorCode: code,
          emailValidatorCodeExp: codeExp,
          accountStatus: "Verifying",
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      });

      if (!userCredential) {
        throw new Error("Email validation code failed to generate");
      }

      const emailR = await sendOTP({ email, code });

      if (!userCredential) {
        throw new Error("OTP failed to generate");
      }
      sendRes = {
        user: { userId: user.id, email: user.email, userName: user.userName },
        credentials: {
          accountStatus: userCredential.accountStatus,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
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

export const verifyEmailDB = async ({
  otp,
  pass,
  activeUser,
}: {
  otp: number;
  pass: string;
  activeUser: IReqVerifyUser;
}) => {
  try {
    let isSuccess: { accessToken: string; refreshToken: string } | null = null;

    if (
      activeUser?.credentials?.emailValidatorCode &&
      activeUser?.credentials?.emailValidatorCodeExp
    ) {
      if (activeUser?.credentials?.emailValidatorCode === otp) {
        if (
          moment(activeUser.credentials.emailValidatorCodeExp).isAfter(now())
        ) {
          const tokens = {
            accessToken: await generateAccessToken({
              accountStatus: "MakingProfile",
              id: activeUser.id,
              userName: activeUser.userName,
            }),
            refreshToken: await generateRefreshToken({
              accountStatus: "MakingProfile",
              id: activeUser.id,
              userName: activeUser.userName,
            }),
          };
          const updating = await prisma.credentials.update({
            where: {
              usersId: activeUser.id,
            },
            data: {
              emailValidatorCode: null,
              emailValidatorCodeExp: null,
              password: await hashedPassword(pass),
              accountStatus: "MakingProfile",
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
            },
            include: { user: true },
          });
          if (updating) {
            isSuccess = {
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
            };
          }
        } else {
          throw new Error("Expire Code");
        }
      } else {
        throw new Error("Invalid Code");
      }
    } else {
      throw new Error("Resend OTP, Internal server error..");
    }

    return isSuccess;
  } catch (error) {
    throw error;
  }
};
export const resendOTP_DB = async (email: string) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
      include: {
        credentials: true,
      },
    });
    const code = generateOTPCode();
    let isSuccess: boolean;
    const codeExp = new Date(Date.now() + 5 * 60 * 1000);
    if (!user) {
      throw new Error("User not registered. Try to signup");
    } else {
      if (user.credentials?.accountStatus !== "Verifying") {
        throw new Error("Account already Verified");
      } else {
        const userCredential = await prisma.credentials.update({
          where: {
            usersId: user.id,
          },
          data: {
            usersId: user.id,
            emailValidatorCode: code,
            emailValidatorCodeExp: codeExp,
          },
        });
        const emailR = await sendOTP({ email, code });
        if (emailR) {
          isSuccess = true;
        } else {
          isSuccess = false;
        }
      }
    }
    return isSuccess;
  } catch (error) {
    throw error;
  }
};

export const updateProfileDB = async (
  activeUser: IReqVerifyUser,
  userInformation: Partial<userInfos>
): Promise<userInfos> => {
  try {
    if (!userInformation) {
      throw new Error("No field selected for update");
    }
    const updatedUserInfo = await prisma.userInfos.update({
      where: { usersId: activeUser.id },
      data: userInformation,
    });

    return updatedUserInfo;
  } catch (error) {
    throw error;
  }
};

export const completeProfileDB = async (
  activeUser: IReqVerifyUser,
  userInformation: Omit<userInfos, "id" | "usersId">
): Promise<users> => {
  try {
    const upUser = await prisma.users.update({
      where: { id: activeUser.id },
      data: {
        credentials: { update: { accountStatus: "Active" } },
        userInfo: { create: { ...userInformation } },
      },
      include: { credentials: true, userInfo: true },
    });
    return upUser;
  } catch (error) {
    throw error;
  }
};

export const loginInfoDB = async (loginInfo: ILogin) => {
  try {
    const user = await prisma.users.findUnique({
      where: { email: loginInfo.email },
      include: { credentials: true },
    });
    if (!user) {
      throw new Error("User not exist");
    } else {
      if (!user.credentials?.password) {
        throw new Error("Password not set try to forget password");
      }
      const isMatchPass = await comparePassword({
        plain: loginInfo.password,
        hashed: user.credentials?.password,
      });
      if (!isMatchPass) {
        throw new Error("Invalid password");
      } else {
        const tokens = {
          accessToken: await generateAccessToken({
            accountStatus: user.credentials.accountStatus,
            id: user.id,
            userName: user.userName,
          }),
          refreshToken: await generateRefreshToken({
            accountStatus: user.credentials.accountStatus,
            id: user.id,
            userName: user.userName,
          }),
        };
        return tokens
      }
    }
  } catch (error) {
    throw error;
  }
};
