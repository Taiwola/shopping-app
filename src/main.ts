import { JwtPayload } from "./common/src/constants/global";
import { AppModule } from "./module";
import express from "express";

declare global {
    namespace Express {
        interface Request {
            currentUser?: JwtPayload,
            uploaderError?: Error
        }
    }
}

const bootstrap = () => {
    const app = new AppModule(express());

    app.start();
};

bootstrap();
