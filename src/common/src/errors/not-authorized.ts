import {CustomError} from "./custom-error"

export class NotAuthorized extends CustomError {
    statusCode = 401;
    constructor(public message: string) {
        super("NOT AUTHORIZED");

        Object.setPrototypeOf(this, NotAuthorized.prototype);
    }

    generateErrors() {
        return [{message: "NOT AUTHORIZED"}];
    }
}