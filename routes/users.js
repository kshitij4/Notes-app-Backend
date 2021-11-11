var express = require('express');
var router = express.Router();
const Student = require("../models/student");
const bcrypt =require("bcryptjs");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/student/register', async function(req, res) {
	try{
	  	//Updating values to the database
      let registerUser=new Student(req.body);
      await registerUser.save();
      res.status(201).json("Registered Successfully");
      }catch(err){
      res.status(400).json(`Error is : ${err}`)
    }
})

router.post('/student/login', async function(req,res){
  try{
		console.log(req.body);
		const email=req.body.email;
		const password=req.body.password;
		const user = await Student.findOne({email:email});
		console.log(user);
    console.log(password+"moving to match"+user.password);
		const Match = await bcrypt.compare(password,user.password);
		console.log("Match hua "+Match);
		const token = await user.generateAuthToken(); //Generating tokens every time user login
		res.cookie("jwt",token,{
			expires:new Date(Date.now() + 900000),
			httpOnly:true
		});
		
		if(Match){
			res.status(201).json({isSuccess : true});
		}
		else{
			res.status(201).json({isSuccess: false,message:"Username or password incorrect"});
		}
	}catch(err){
		res.status(400).json(`User dose not exist`);
	}
})

module.exports = router;
