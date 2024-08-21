import { Model, model, models, Schema } from "mongoose";
import { IEmployeeSchema } from "../lib/interfaces";

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