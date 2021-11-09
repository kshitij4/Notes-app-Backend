const mongoose = require("mongoose");
const bcrypt =require("bcryptjs");
const jwt = require('jsonwebtoken');
const memberSchema = mongoose.Schema({
    firstname:{
        type:String,
    },
    lastname:{
        type:String,
    },
	email: {
        type: String,
        trim:true,
        unique:true
	},
	phone: {
		type: Number,
	},
    password:{
        type:String,
        required:true,
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]

});
memberSchema.methods.generateAuthToken = async function(){
    try{
        const token = jwt.sign({id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    }catch(err){
        res.send(err);
        console.log(err);
    }
}
//hashing
memberSchema.pre("save",async function(next){
    if(this.isModified("password")){
    // console.log(` Before hashing password ${this.password}`);
    this.password = await bcrypt.hash(this.password,10);
    // console.log(`After hashing password ${this.password}`);
    }
    next();
})

const Student = new mongoose.model("student", memberSchema);
module.exports = Student;