"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataBaseError = void 0;
const custom_error_1 = require("./custom-error");
class DataBaseError extends custom_error_1.CustomError {
    constructor(message) {
        super("db connection error");
        this.message = message;
        this.statusCode = 500;
    }
    generateErrors() {
        return [{ message: "db connection error" }];
    }
}
exports.DataBaseError = DataBaseError;
