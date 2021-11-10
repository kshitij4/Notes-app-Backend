var express = require('express');
var router = express.Router();
let auth = require('../middleware/auth');
const Note = require("../models/notes")

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/createnote",async (req, res) => {
	try{
		console.log(req.body.description)
		let notes = new Note({
        userId:req.body.userId,
		title:req.body.title,
        description:req.body.description		
		});		
		const data = await notes.save();
		res.status(201).json({ message: "Notes Added" });
	}catch (error) {
		console.log(req.body);
		res.status(404).json({ "error message :": `Error Occured biro ${error}` });
		console.log(error);
		}	
});

router.get("/searchNote/:userId",async(req,res)=>{
	try{
		const userId = req.params.userId;
        console.log(userId);
		const data = await Note.find({userId:userId});
		if(data!=null || JSON.stringify(req.userId)=== JSON.stringify(data._id)){
			res.status(201).json(data);
		}else{
			res.status(408).json({message:"Create your first Note",
            isSuccess:false
        });
		}
	}catch(error){
        res.status(404).json({error_message:"Error Occured",
        isSuccess:false})
	}
})

router.post("/userId/:userId/updateNote/:noteId",async(req,res)=>{
    try{
        const userId = req.params.userId;
        const noteId = req.params.noteId;
		const data= await Note.findOneAndUpdate({_id:noteId},{$set:{
            userId:userId,
			title:req.body.title,
            description:req.body.description		
		    }
        });  
        res.status(200).json({message:"Updated successfully",
    isSuccess:true})  
    }catch(error){
        res.status(404).json({error_message:"Error Occured",
        isSuccess:false
    })
    }
})

module.exports = router;