import { Model, model, models, Schema } from "mongoose";
import { ITransactionSchema } from "../lib/interfaces";

const transactionSchema: Schema<ITransactionSchema> = new Schema<ITransactionSchema>({
    TransactionId: { type: Number, required: true, unique: true },
    SenderId: { type: Number, required: true },
    ReceiverId: { type: Number, required: true },
    Amount: { type: Number, required: true },
    Timestamp: { type: Date, default: Date.now },
});

const TransactionModel =
    (models.Transaction as Model<ITransactionSchema>) ||
    model<ITransactionSchema>("Transaction", transactionSchema);

export default TransactionModel;