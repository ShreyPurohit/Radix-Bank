import { Model, model, models, Schema } from "mongoose";
import { IUserSchema } from "../lib/interfaces";

const userSchema: Schema<IUserSchema> = new Schema<IUserSchema>({
    Id: { type: Number, required: true, unique: true },
    Username: { type: String, required: true },
    Password: { type: String, required: true },
});

const UserModel = (models.User as Model<IUserSchema>) || model<IUserSchema>("User", userSchema);

export default UserModel;