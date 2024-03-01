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
exports.initUserDB = exports.getAUserWithEmailDB = void 0;
const Mail_1 = __importDefault(require("../../connection/mail/Mail"));
const OTPTemplete_1 = __importDefault(require("../../connection/mail/OTPTemplete"));
const prismaInstance_1 = __importDefault(require("../../connection/prisma/prismaInstance"));
const getAUserWithEmailDB = ({ email }) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prismaInstance_1.default.users.findUnique({
        where: { email },
        include: { userInfo: true },
    });
    return user;
});
exports.getAUserWithEmailDB = getAUserWithEmailDB;
const initUserDB = ({ email, fullName, }) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistEmail = yield (0, exports.getAUserWithEmailDB)({ email });
    // is email exist
    if (isExistEmail) {
        throw new Error("User Already exist");
    }
    const code = Math.floor(1000 + Math.random() * 9000);
    const codeExp = new Date(Date.now() + 5 * 60 * 1000);
    try {
        yield prismaInstance_1.default.$transaction((Tprisma) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield Tprisma.users.create({
                data: { email },
            });
            if (!user) {
                throw new Error("User registration failed");
            }
            const userCradential = yield Tprisma.credentials.create({
                data: {
                    usersId: user.id,
                    emailValidatorCode: code,
                    emailValidatorCodeExp: codeExp,
                    accountStatus: "MakingUserName",
                },
            });
            if (!userCradential) {
                throw new Error("Email validation code failed to generate");
            }
            const emailR = yield (0, Mail_1.default)({
                html: (0, OTPTemplete_1.default)({ code }),
                subject: "OTP Verification",
                text: "Please use the verification code below to sign in. " + code,
                to: email,
            });
            if (!userCradential) {
                throw new Error("OTP failed to generate");
            }
        }));
    }
    catch (error) {
        throw error;
    }
});
exports.initUserDB = initUserDB;
