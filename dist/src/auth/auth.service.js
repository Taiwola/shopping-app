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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const user_service_1 = require("../user/user.service");
const index_1 = require("../common/src/index");
class AuthService {
    constructor(userService, authenticationService) {
        this.userService = userService;
        this.authenticationService = authenticationService;
    }
    signup(createUser, errCallBack) {
        return __awaiter(this, void 0, void 0, function* () {
            const userExist = yield this.userService.findOneByEmail(createUser.email);
            if (userExist)
                throw new Error("user exist");
            const newUser = yield this.userService.create(createUser);
            const jwt = this.authenticationService.generateJwt({ email: createUser.email, userId: newUser._id });
            return jwt;
        });
    }
    signin(sign_in, errCallBack) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.findOneByEmail(sign_in.email);
            if (!user) {
                throw new Error("user exist");
            }
            const comparePassword = yield this.authenticationService.pwdCompare(user.password, sign_in.password);
            if (!comparePassword) {
                return { message: "wrong credentials" };
            }
            const jwt = this.authenticationService.generateJwt({ email: user.email, userId: user._id });
            return jwt;
        });
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService(user_service_1.userService, new index_1.AuthenticationService());
