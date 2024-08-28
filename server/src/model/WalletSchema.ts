import { Model, model, models, Schema } from "mongoose";
import { IWalletSchema } from "../lib/interfaces";

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