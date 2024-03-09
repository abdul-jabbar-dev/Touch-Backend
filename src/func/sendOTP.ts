import sendMailWithGmail from "../connection/mail/Mail";
import OTP_MAIL_UI from "../connection/mail/OTPTemplete";

export const generateOTPCode = () => Math.floor(1000 + Math.random() * 9000);
export const sendOTP = async ({
  email,
  code,
}: {
  email: string;
  code: number;
}) => {
  const emailR = await sendMailWithGmail({
    html: OTP_MAIL_UI({ code }),
    subject: "OTP Verification",
    text: "Please use the verification code below to sign in. " + code,
    to: email,
  }).catch((er) => console.log(er));
  return emailR;
};
