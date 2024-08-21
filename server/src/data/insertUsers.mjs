import mongoose, { Schema } from "mongoose";

const userSchema = new Schema ({

    Id: { type: Number, required: true, unique: true },

    Username: { type: String, required: true },

    Password: { type: String, required: true },

});

const users = [

    { Id: 1, Username: "john_doe", Password: "password1" },

    { Id: 2, Username: "jane_smith", Password: "password2" },

    { Id: 3, Username: "emily_johnson", Password: "password3" },

    { Id: 4, Username: "michael_williams", Password: "password4" },

    { Id: 5, Username: "sarah_brown", Password: "password5" },

    { Id: 6, Username: "david_jones", Password: "password6" },

    { Id: 7, Username: "laura_garcia", Password: "password7" },

    { Id: 8, Username: "james_martinez", Password: "password8" },

    { Id: 9, Username: "linda_hernandez", Password: "password9" },

    { Id: 10, Username: "robert_lopez", Password: "password10" },

];

const User = mongoose.model("User", userSchema);

async function insertData() {
    await mongoose.connect('mongodb://localhost:27017/RadixPaymentsdemo')
    await User.insertMany(users)
    console.log("users inserted")
    await mongoose.disconnect()
}

insertData()
