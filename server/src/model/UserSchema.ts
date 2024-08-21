import { Document, Model, model, models, Schema } from "mongoose";

interface IUserSchema extends Document {
    Id: number,
    Username: string,
    Password: string,
}

const userSchema: Schema<IUserSchema> = new Schema<IUserSchema>({

    Id: { type: Number, required: true, unique: true },

    Username: { type: String, required: true },

    Password: { type: String, required: true },

});

const UserModel = (models.User as Model<IUserSchema>) || model<IUserSchema>("User", userSchema);

export default UserModel;