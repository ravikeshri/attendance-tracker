const mongoose   = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    isTeacher: {
        type: Boolean,
        required: true
    },
    department: String,
    stream: String,
    phone: {
        type: String,
        required: true
    },
    classes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class"
        }
    ]
});

module.exports = mongoose.model("User", userSchema);