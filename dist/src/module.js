"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.AppModule = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = require("body-parser");
const cookie_session_1 = __importDefault(require("cookie-session"));
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("./common/src/index");
const auth_routes_1 = require("./auth/auth.routes");
class AppModule {
    constructor(app) {
        this.app = app;
        app.set("trust-proxy", true);
        // use middlewares
        app.use((0, cors_1.default)({
            origin: "*",
            credentials: true,
            optionsSuccessStatus: 200,
        }));
        app.use((0, body_parser_1.urlencoded)({ extended: false }));
        app.use((0, body_parser_1.json)());
        app.use((0, cookie_session_1.default)({
            signed: false,
            secure: false,
        }));
        // use routers
        app.use("/api/auth", auth_routes_1.authRouter);
        // use error handler
        app.use(index_1.errorHandler);
        Object.setPrototypeOf(this, AppModule.prototype);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!process.env.MONGODB_URL) {
                throw new Error("mongo_url must be defined");
            }
            if (!process.env.JWT_SECRET_KEY) {
                throw new Error("secret key must be defined");
            }
            try {
                yield mongoose_1.default.connect(process.env.MONGODB_URL);
                console.log("connected to DB");
            }
            catch (error) {
                throw new Error("mongodb connection error");
            }
            this.app.listen(8080, () => console.log("SERVER LISTENING AT PORT:8080"));
        });
    }
}
exports.AppModule = AppModule;
