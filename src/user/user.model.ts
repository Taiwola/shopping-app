import mongoose, { Schema, mongo } from "mongoose";
import {UserModel, UserDoc, AuthenticationService} from "../common/src/index"

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret.id;
            delete ret.password
        }
    }
});

UserSchema.pre('save', async function(done) {
    const authenticationService = new AuthenticationService();
    if(this.isModified('password') || this.isNew) {
        const hashedPwd = authenticationService.pwdToHash(this.get('password'));
        this.set('password', hashedPwd);
    }

    done();
})

export const User = mongoose.model<UserDoc, UserModel>("User", UserSchema);