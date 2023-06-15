"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequest = void 0;
const custom_error_1 = require("./custom-error");
class BadRequest extends custom_error_1.CustomError {
    constructor(message) {
        super(message);
        this.message = message;
        this.statusCode = 400;
    }
    generateErrors() {
        return [{ message: this.message }];
    }
}
exports.BadRequest = BadRequest;
