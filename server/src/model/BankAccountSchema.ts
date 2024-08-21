import { Model, model, models, Schema } from "mongoose";
import { IBankAccountSchema } from "../lib/interfaces";

const bankAccountSchema: Schema<IBankAccountSchema> = new Schema<IBankAccountSchema>({
    BankAccountId: { type: Number, required: true, unique: true },
    EmployeeId: { type: Number, required: true },
    BankName: { type: String, required: true },
    AccountNumber: { type: String, required: true },
    Balance: { type: Number, required: true },
});


const BankAccountModel =
    (models.BankAccount as Model<IBankAccountSchema>) ||
    model<IBankAccountSchema>("BankAccount", bankAccountSchema);

export default BankAccountModel;