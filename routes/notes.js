var express = require("express");
var router = express.Router();
let auth = require("../middleware/auth");
const Note = require("../models/notes");

router.get("/", function (req, res, next) {
	res.render("index", { title: "Express" });
});

router.post("/createnote", async (req, res) => {
	let respObj = {
		isSuccess: false,
		message: "Initial message",
		Data: null,
	};
	try {
		let data = Note.findOneAndUpdate(
			{ userId: req.body.userId },
			{
				$push: {
					notes: {
						title: req.body.title,
						description: req.body.description,
					},
				},
			},
			{ upsert: true },
			function (error, success) {
				if (error) {
					console.log("error is" + error);
				} else {
					console.log("successs" + success);
				}
			}
		);
		respObj.isSuccess = true;
		respObj.message = "Note Added Successfully";
		console.log(data);
		res.status(201).json(respObj);
	} catch (error) {
		res.status(404).json({ error_message: `Error Occured biro ${error}` });
		console.log("error is" + error);
	}
});

router.get("/searchNote/:userId", async (req, res) => {
	let respObj = {
		isSuccess: false,
		message: "Initial message",
		Data: [],
	};
	try {
		const userId = req.params.userId;
		const data = await Note.find({ userId: userId });
		console.log(data);
		if (data.length > 0 && data[0].notes.length > 0 && JSON.stringify(req.userId) === JSON.stringify(data._id)) {
			respObj.Data = data[0].notes;
			respObj.message = data[0].notes.length +" Notes found";
			respObj.isSuccess = true;
			res.status(200).json(respObj);
		} else {
			respObj.message = "No Notes found";
			res.status(404).json(respObj);
		}
	} catch (error) {
		respObj.message = "Error Occured";
		res.status(500).json(respObj);
	}
});

router.post("/updateNote/:noteId", async (req, res) => {
	let respObj = {
		isSuccess: false,
		message: "Initial message",
		Data: null,
	};
	try {
		const userId = req.body.userId;
		const noteId = req.params.noteId;
		const data = await Note.findOneAndUpdate(
			{ _id: noteId },
			{
				$set: {
					userId: userId,
					title: req.body.title,
					description: req.body.description,
				},
			}
		);
		respObj.message = "Updated successfully";
		respObj.isSuccess =true;
		res.status(200).json(respObj);
	} catch (error) {
		respObj.message = "Error Occured" + error; 
		res.status(404).json(respObj);
	}
});

router.delete('/userId/:userId/deleteNote/:noteId', async (req,res) => {
	let respObj = {
		isSuccess: false,
		message: "Initial message",
		Data: null,
	};

	try {
		const userId = req.params.userId;
		const noteId = req.params.noteId;
		const data = await Note.updateOne(
			{ userId: userId },
			{ $pull : { notes : { _id: noteId}}}
		);
		respObj.message = "Deleted successfully";
		respObj.isSuccess = true;
		res.status(200).json(respObj);
	} catch (error) {
		respObj.message = "Error Occured" + error; 
		res.status(404).json(respObj);
	}
})

module.exports = router;
