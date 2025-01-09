const mongoose = require("mongoose");
const uri = "mongodb://127.0.0.1:27017/tuesday";

mongoose.connect(uri)
    .then(() => {
        console.log("Database connected");
    })
    .catch((err) => {
        console.log("Database connection error:", err);
    });

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: {
        type: String  // Field to store the reset token
    },
    tokenExpiry: {
        type: Date    // Field to store the expiry date of the token
    }
});

module.exports = mongoose.model('User', userSchema);
