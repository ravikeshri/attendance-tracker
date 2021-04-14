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
                attendance: [ Date ]
            }
    ],
    dates: [ Date ]
});

module.exports = mongoose.model("Class", classSchema);