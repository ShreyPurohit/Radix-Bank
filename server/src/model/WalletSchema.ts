import { Document, Model, model, models, Schema } from "mongoose";

interface IWalletSchema extends Document {
    WalletId: number,
    EmployeeId: number,
    Balance: number,
    CreatedDate: Date,
    UpdatedDate: Date,
}

const walletSchema: Schema<IWalletSchema> = new Schema<IWalletSchema>({
    WalletId: { type: Number, required: true, unique: true },
    EmployeeId: { type: Number, required: true },
    Balance: { type: Number, required: true },
    CreatedDate: { type: Date, default: Date.now },
    UpdatedDate: { type: Date, default: Date.now },
});


const WalletModel =
    (models.Wallet as Model<IWalletSchema>) ||
    model<IWalletSchema>("Wallet", walletSchema);

export default WalletModel;