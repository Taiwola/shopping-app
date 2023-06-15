import { Router, Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import { currentUser } from "../common/src/index";

const router = Router();

// use router
// all get request
router.get("/current-user", currentUser(process.env.JWT_SECRET_KEY!), async(req: Request, res: Response, next: NextFunction) => {
 
    res.status(200).send(req.currentUser);
});

// all post routes
router.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const result = await authService.signup({ email, password }, next);


    req.session = { result };

    res.status(201).send({ success: true });
  }
);

router.post(
  "/signin",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    
    try {
      const jwt = await authService.signin({ email, password }, next);
      req.session = { jwt };
      
    } catch (error) {
      console.log(error);
      return res.status(500).json({message: "internal server error"});
    }


   res
      .status(200)
      .json({
        success: true,
        message: "user logged in successfully",
      });
  }
);


export {router as authRouter};
