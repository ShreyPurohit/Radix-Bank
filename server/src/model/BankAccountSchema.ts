import { Document, Model, model, models, Schema } from "mongoose";

interface IBankAccountSchema extends Document {
    BankAccountId: number,
    EmployeeId: number,
    BankName: string,
    AccountNumber: string,
    Balance: number
}

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