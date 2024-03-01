"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app/app"));
const config_1 = __importDefault(require("./config"));
const GlobalError_1 = __importDefault(require("./middlewares/GlobalError"));
const route_1 = __importDefault(require("./routes/route"));
app_1.default.use('/api', route_1.default);
app_1.default.use(GlobalError_1.default);
app_1.default.listen(config_1.default.port, () => console.log(`Server is running in PORT: ${config_1.default.port}`));
