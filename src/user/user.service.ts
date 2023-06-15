import { UserModel } from "../common/src/index";
import { User } from "./user.model";
import { CreateUserDto } from "../dtos/auth.dto";

export class UserService {
    constructor (
        public userModel: UserModel
    ){}

    async create(createUser: CreateUserDto){
        const user = new this.userModel({
            email: createUser.email,
            password: createUser.password
        });

        return await user.save();
    }

    async findOneByEmail(email: string) {
        return await this.userModel.findOne({email});
    }
}

export const userService = new UserService(User);

