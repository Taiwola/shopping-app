import {CustomError} from "./custom-error"

export class NotFound extends CustomError {
    statusCode = 404;
    constructor(public message: string) {
        super('NOT FOUND');
    }

    generateErrors() {
        return [{message: "NOT FOUND"}];
    }
}