import { Document, Model, model, models, Schema } from "mongoose";

interface IEmployeeSchema extends Document {
    EmployeeId: number,
    FirstName: string,
    LastName: string,
    Email: string
}

const employeeSchema: Schema<IEmployeeSchema> = new Schema<IEmployeeSchema>({
    EmployeeId: { type: Number, required: true, unique: true },
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    Email: { type: String, required: true },
});

const EmployeeModel =
    (models.Employee as Model<IEmployeeSchema>) ||
    model<IEmployeeSchema>("Employee", employeeSchema);

export default EmployeeModel;