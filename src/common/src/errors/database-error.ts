import {CustomError} from "./custom-error"

export class DataBaseError extends CustomError {
    statusCode = 500;
    constructor(public message: string) {
        super("db connection error");

        Object.setPrototypeOf(this, DataBaseError.prototype);
    }

    generateErrors() {
        return [{message: "db connection error"}];
    }
}