import mongoose, { Schema } from "mongoose";

const employeeSchema = new Schema({
    EmployeeId: { type: Number, required: true, unique: true },
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    Email: { type: String, required: true },
});


const Employee = mongoose.model("Employee", employeeSchema);

const employees = [

    {

        EmployeeId: 1,

        FirstName: "John",

        LastName: "Doe",

        Email: "john.doe@example.com",

    },

    {

        EmployeeId: 2,

        FirstName: "Jane",

        LastName: "Smith",

        Email: "jane.smith@example.com",

    },

    {

        EmployeeId: 3,

        FirstName: "Emily",

        LastName: "Johnson",

        Email: "emily.johnson@example.com",

    },

    {

        EmployeeId: 4,

        FirstName: "Michael",

        LastName: "Brown",

        Email: "michael.brown@example.com",

    },

    {

        EmployeeId: 5,

        FirstName: "Sarah",

        LastName: "Davis",

        Email: "sarah.davis@example.com",

    },

    {

        EmployeeId: 6,

        FirstName: "David",

        LastName: "Miller",

        Email: "david.miller@example.com",

    },

    {

        EmployeeId: 7,

        FirstName: "Laura",

        LastName: "Wilson",

        Email: "laura.wilson@example.com",

    },

    {

        EmployeeId: 8,

        FirstName: "James",

        LastName: "Moore",

        Email: "james.moore@example.com",

    },

    {

        EmployeeId: 9,

        FirstName: "Linda",

        LastName: "Taylor",

        Email: "linda.taylor@example.com",

    },

    {

        EmployeeId: 10,

        FirstName: "Robert",

        LastName: "Anderson",

        Email: "robert.anderson@example.com",

    },

];

async function insertData() {
    await mongoose.connect('mongodb://localhost:27017/RadixPaymentsdemo')
    await Employee.insertMany(employees)
    console.log("employees inserted")
    await mongoose.disconnect()
}

insertData()