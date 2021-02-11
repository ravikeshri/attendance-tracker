var mongoose = require("mongoose");

var classSchema = new mongoose.Schema({
    name: String,
    code: String,
    stream: String,
    department: String,
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    students: [
            {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                attendance: [
                    {
                        date: Date,
                        status: String
                    }
                ]
            }
    ],
    dates: [ Date ]
});

module.exports = mongoose.model("Class", classSchema);