const mongoose = require("mongoose");
const notesSchema = mongoose.Schema({
	userId:{
		type:mongoose.Schema.Types.ObjectId,
		required:true,
		ref:"Student"
	},
    title:{
        type:String,
    },
    description:{
        type:String,
    }

});

const Notes = new mongoose.model("notes", notesSchema);
module.exports = Notes;