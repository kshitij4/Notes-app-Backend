var express = require('express');
var router = express.Router();
let auth = require('../middleware/auth');
const Note = require("../models/notes")

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/createnote",async (req, res) => {
	let respObj = {
        isSuccess: false,
        message: "OK",
        Data: null
    };
	try{
     	let data = Note.findOneAndUpdate(
			{ userId: req.body.userId }, 
			{ $push: { notes:{
				title:req.body.title,
				description:req.body.description
			}}},
			{ upsert: true },
		   function (error, success) {
				 if (error) {
					 console.log('error is'+error);
				 } else {
					 console.log('successs'+success);
				 }
			 });
			 respObj.isSuccess = true;
			 console.log(data)
		res.status(201).json(respObj);

	}catch (error) {
		res.status(404).json({ error_message : `Error Occured biro ${error}` });
		console.log('error is'+error);
		}	
});

router.get("/searchNote/:userId",async (req,res)=>{
	let respObj = {
        isSuccess: false,
        message: "OK",
        Data: null
    };
	try{
		const userId = req.params.userId;
        console.log(userId);
		const data = await Note.find({userId:userId});
		if(data!=null || JSON.stringify(req.userId)=== JSON.stringify(data._id)){
			respObj.isSuccess=true
			respObj.Data= data[0].notes;
			res.status(201).json(respObj);
		}else{
			res.status(408).json({message:"Create your first Note",
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