import mongoose, { Schema } from "mongoose";

const bankAccountSchema= new Schema({
    BankAccountId: { type: Number, required: true, unique: true },
    EmployeeId: { type: Number, required: true },
    BankName: { type: String, required: true },
    AccountNumber: { type: String, required: true },
    Balance: { type: Number, required: true },
});

const BankAccount = mongoose.model("BankAccount", bankAccountSchema);

const bankAccounts = [

    {

        BankAccountId: 1,

        EmployeeId: 1,

        BankName: "Bank A",

        AccountNumber: "1234567890",

        Balance: 1000,

    },

    {

        BankAccountId: 2,

        EmployeeId: 2,

        BankName: "Bank B",

        AccountNumber: "2345678901",

        Balance: 1500,

    },

    {

        BankAccountId: 3,

        EmployeeId: 3,

        BankName: "Bank C",

        AccountNumber: "3456789012",

        Balance: 2000,

    },

    {

        BankAccountId: 4,

        EmployeeId: 4,

        BankName: "Bank D",

        AccountNumber: "4567890123",

        Balance: 2500,

    },

    {

        BankAccountId: 5,

        EmployeeId: 5,

        BankName: "Bank E",

        AccountNumber: "5678901234",

        Balance: 3000,

    },

    {

        BankAccountId: 6,

        EmployeeId: 6,

        BankName: "Bank F",

        AccountNumber: "6789012345",

        Balance: 3500,

    },

    {

        BankAccountId: 7,

        EmployeeId: 7,

        BankName: "Bank G",

        AccountNumber: "7890123456",

        Balance: 4000,

    },

    {

        BankAccountId: 8,

        EmployeeId: 8,

        BankName: "Bank H",

        AccountNumber: "8901234567",

        Balance: 4500,

    },

    {

        BankAccountId: 9,

        EmployeeId: 9,

        BankName: "Bank I",

        AccountNumber: "9012345678",

        Balance: 5000,

    },

    {

        BankAccountId: 10,

        EmployeeId: 10,

        BankName: "Bank J",

        AccountNumber: "0123456789",

        Balance: 5500,

    },

];

async function insertData() {
    await mongoose.connect('mongodb://localhost:27017/RadixPaymentsdemo')
    await BankAccount.insertMany(bankAccounts)
    console.log("accounts inserted")
    await mongoose.disconnect()
}

insertData()