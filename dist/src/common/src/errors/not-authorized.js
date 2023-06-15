"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotAuthorized = void 0;
const custom_error_1 = require("./custom-error");
class NotAuthorized extends custom_error_1.CustomError {
    constructor(message) {
        super("NOT AUTHORIZED");
        this.message = message;
        this.statusCode = 401;
    }
    generateErrors() {
        return [{ message: "NOT AUTHORIZED" }];
    }
}
exports.NotAuthorized = NotAuthorized;
