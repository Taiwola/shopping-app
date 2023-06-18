import {CustomError} from "./custom-error"

export class NotFound extends CustomError {
    statusCode = 404;
    constructor(public message: string) {
        super('NOT FOUND');

        Object.setPrototypeOf(this, NotFound.prototype);
    }

    generateErrors() {
        return [{message: "NOT FOUND"}];
    }
}