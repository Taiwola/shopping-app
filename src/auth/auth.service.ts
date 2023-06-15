import { UserService, userService } from "../user/user.service";
import { CreateUserDto, SigninDto } from "../dtos/auth.dto";
import { NextFunction } from "express";
import { BadRequest, AuthenticationService } from "../common/src/index";

export class AuthService {
  constructor(
    public userService: UserService,
    public authenticationService: AuthenticationService
    ) {}

  async signup(createUser: CreateUserDto, errCallBack: NextFunction) {
    const userExist = await this.userService.findOneByEmail(createUser.email);
    if (userExist) throw new Error("user exist");

    const newUser = await this.userService.create(createUser);

    const jwt = this.authenticationService.generateJwt({email: createUser.email, userId: newUser._id });

    return jwt;
  }

  async signin(sign_in: SigninDto, errCallBack: NextFunction) {
        const user = await this.userService.findOneByEmail(sign_in.email);
        if(!user) {
           throw new Error("user exist");
        }

        const comparePassword = await this.authenticationService.pwdCompare(user.password, sign_in.password);

        if(!comparePassword) {
            return {message: "wrong credentials"};
        }

        const jwt = this.authenticationService.generateJwt({email: user.email, userId: user._id});

        return jwt;


  }
}

export const authService = new AuthService(userService, new AuthenticationService());
