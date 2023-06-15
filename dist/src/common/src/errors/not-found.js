"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFound = void 0;
const custom_error_1 = require("./custom-error");
class NotFound extends custom_error_1.CustomError {
    constructor(message) {
        super('NOT FOUND');
        this.message = message;
        this.statusCode = 404;
    }
    generateErrors() {
        return [{ message: "NOT FOUND" }];
    }
}
exports.NotFound = NotFound;
