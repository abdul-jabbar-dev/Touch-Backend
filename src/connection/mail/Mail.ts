import ENV from "../../config";
import IMail from "../../interface/mail/IMail";
const nodemailer = require("nodemailer");
const { google } = require("googleapis");


const oAuth2Client = new google.auth.OAuth2(
  ENV.CLIENT_ID,
  ENV.CLIENT_SECRET,
  ENV.REDIRECT_URIS
  );
  oAuth2Client.setCredentials({ refresh_token: ENV.REFRESH_TOKEN });
  
  const sendMailWithGmail = async (data: IMail) => {
  
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    console.log({
      type: "OAuth2",
      user: ENV.SENDER_MAIL,
      clientId: ENV.CLIENT_ID,
      clientSecret: ENV.CLIENT_SECRET,
      refreshToken: ENV.REFRESH_TOKEN,
      accessToken: accessToken.token,
    });
    let transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: ENV.SENDER_MAIL,
        clientId: ENV.CLIENT_ID,
        clientSecret: ENV.CLIENT_SECRET,
        refreshToken: ENV.REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });
    const mailData: IMail | { from: string } = {
      from: `"Touch service" <${ENV.SENDER_MAIL as string}>`,
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.html,
    };
    let info = await transport.sendMail(mailData);
    return info;
  } catch (error) {
    throw error;
  }
};
export default sendMailWithGmail;
