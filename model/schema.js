const mongoose = require("mongoose");

//schema to upload files
const fileSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now,
    },
    name: {
        type: String,
        required: [true, "Uploaded file must have a name"],
    },
});

const File = mongoose.model("File", fileSchema);

module.exports = File;