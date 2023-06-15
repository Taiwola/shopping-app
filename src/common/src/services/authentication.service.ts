import jwt from "jsonwebtoken";
import { JwtPayload } from "../constants/global";
import * as bcrypt from "bcrypt";

export class AuthenticationService {
  generateJwt(payload: JwtPayload) {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY!, { expiresIn: "2h" });
  }

  async pwdToHash(password: string) {
    const saltRounds = 10;
    // Generate a salt
    const hashPwd = await bcrypt.hash(password, saltRounds);

    return hashPwd;
  }

  async pwdCompare(storedPassword: string, suppiedPassword: string) {
    try {
      const comparePwd = await bcrypt.compare(suppiedPassword, storedPassword);
      return true;
    } catch (e) {
      console.error(`Error in comparing passwords`, e);
      return false;
    }
  }

  verifyJwt(jwtToken: string) {
    return jwt.verify(jwtToken, process.env.JWT_SECRET_KEY!) as JwtPayload
  }
}
