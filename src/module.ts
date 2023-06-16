import * as dotenv from "dotenv";
dotenv.config();

import { Application } from "express";
import cors from "cors";
import { urlencoded, json } from "body-parser";
import cookieSession from "cookie-session";
import mongoose from "mongoose";
import { errorHandler } from "./common/src/index";
import { authRouter } from "./auth/auth.routes";
import { currentUser } from "./common/src/index";
import { sellerRouter } from "./seller/seller.router";

export class AppModule {
  constructor(public app: Application) {
    app.set("trust-proxy", true);

    // use middlewares
    app.use(
      cors({
        origin: "*",
        credentials: true,
        optionsSuccessStatus: 200,
      })
    );

    app.use(urlencoded({ extended: false }));
    app.use(json());
    app.use(
      cookieSession({
        signed: false,
        secure: false,
      })
    );

    Object.setPrototypeOf(this, AppModule.prototype);
  }

  async start() {
    if (!process.env.MONGODB_URL) {
      throw new Error("mongo_url must be defined");
    }

    if (!process.env.JWT_SECRET_KEY) {
      throw new Error("secret key must be defined");
    }

    try {
      await mongoose.connect(process.env.MONGODB_URL);
      console.log("connected to DB");
    } catch (error) {
      throw new Error("mongodb connection error");
    }

    // use routers
    this.app.use(currentUser(process.env.JWT_SECRET_KEY!));
    this.app.use("/api/auth", authRouter);
    this.app.use("api/seller", sellerRouter)

    // use error handler
    this.app.use(errorHandler);

    this.app.listen(8080, () => console.log("SERVER LISTENING AT PORT:8080"));
  }
}
