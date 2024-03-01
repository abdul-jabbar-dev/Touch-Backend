"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ENV = {
    port: 3001,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    REDIRECT_URIS: process.env.REDIRECT_URIS,
    REFRESH_TOKEN: process.env.REFRESH_TOKEN,
    SENDER_MAIL: process.env.SENDER_MAIL,
};
exports.default = ENV;
