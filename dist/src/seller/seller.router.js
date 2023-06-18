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
const express_1 = require("express");
const index_1 = require("../common/src/index");
const seller_service_1 = require("./seller.service");
const uploader = new index_1.Uploader(index_1.uploadDir);
const middlewareOptions = {
    types: ["image/png", "image/jpg", "image/jpeg"],
    fieldName: "image",
};
const multipleFiles = uploader.uploadMultipleFiles(middlewareOptions);
const router = (0, express_1.Router)();
router.post("/product/new", index_1.RequireAuth, multipleFiles, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, price } = req.body;
    if (!req.files)
        return next(new index_1.BadRequest("image are required"));
    if (req.uploaderError)
        return next(new index_1.BadRequest(req.uploaderError.message));
    let product = yield seller_service_1.sellerService.addProduct({
        title,
        price,
        userId: req.currentUser.userId,
        files: req.files,
    });
    res.status(200).send(product);
}));
