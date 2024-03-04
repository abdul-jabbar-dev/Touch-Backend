const ENV = {
  port: 3001,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  REDIRECT_URIS: process.env.REDIRECT_URIS,
  REFRESH_TOKEN: process.env.REFRESH_TOKEN,
  SENDER_MAIL: process.env.SENDER_MAIL,
  SALT: process.env.SALT,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_TOKEN_EXP: {
    ACCESS_TOKEN_EXP: "90d",
    REFRESH_TOKEN_EXP: "3d",
  },
};
export default ENV;
