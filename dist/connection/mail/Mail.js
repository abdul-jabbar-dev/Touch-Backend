"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config"));
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const oAuth2Client = new google.auth.OAuth2(config_1.default.CLIENT_ID, config_1.default.CLIENT_SECRET, config_1.default.REDIRECT_URIS);
oAuth2Client.setCredentials({ refresh_token: config_1.default.REFRESH_TOKEN });
const sendMailWithGmail = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = yield oAuth2Client.getAccessToken();
        console.log({
            type: "OAuth2",
            user: config_1.default.SENDER_MAIL,
            clientId: config_1.default.CLIENT_ID,
            clientSecret: config_1.default.CLIENT_SECRET,
            refreshToken: config_1.default.REFRESH_TOKEN,
            accessToken: accessToken.token,
        });
        let transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: config_1.default.SENDER_MAIL,
                clientId: config_1.default.CLIENT_ID,
                clientSecret: config_1.default.CLIENT_SECRET,
                refreshToken: config_1.default.REFRESH_TOKEN,
                accessToken: accessToken.token,
            },
        });
        const mailData = {
            from: `"Touch service" <${config_1.default.SENDER_MAIL}>`,
            to: data.to,
            subject: data.subject,
            text: data.text,
            html: data.html,
        };
        let info = yield transport.sendMail(mailData);
        return info;
    }
    catch (error) {
        throw error;
    }
});
exports.default = sendMailWithGmail;
