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
exports.authRouter = void 0;
const express_1 = require("express");
const auth_service_1 = require("./auth.service");
const index_1 = require("../common/src/index");
const router = (0, express_1.Router)();
exports.authRouter = router;
// use router
// all get request
router.get("/current-user", (0, index_1.currentUser)(process.env.JWT_SECRET_KEY), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send(req.currentUser);
}));
// all post routes
router.post("/signup", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const result = yield auth_service_1.authService.signup({ email, password }, next);
    req.session = { result };
    res.status(201).send({ success: true });
}));
router.post("/signin", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const jwt = yield auth_service_1.authService.signin({ email, password }, next);
        req.session = { jwt };
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server error" });
    }
    res
        .status(200)
        .json({
        success: true,
        message: "user logged in successfully",
    });
}));
