const express= require("express");
const bcrypt=require("bcrypt");

const { validateSignUpData } = require("../utils/validation");
const { User } = require("../models/user");
const authRouter= express.Router();

authRouter.post("/signup", async (req, res) => {
   const {firstName, lastName, emailId, password}=req.body;
   try{
       //validation at api level
       validateSignUpData(req);
       //password hasing
       const hasPassword=await bcrypt.hash(password, 10)
       console.log("hasPassword",hasPassword)
       const user=new User({firstName, lastName, emailId, password:hasPassword})
       await user.save();
       res.send("User added successfully....")
   }catch(err){
       res.status(400).send("Error while saving the User" + err);
   }
})

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        if (!emailId || !password) {
            return res.status(400).send("Email and password are required.");
        }
        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(401).send("User not found...");
        }
        const isPassValid = await user.validatePassword(password);
        if (isPassValid) {
            const token = await user.getJWT();
            res.cookie("token", token);
            res.send("Login successful...");
        } else {
            res.status(401).send("Invalid email/password");
        }
    } catch (err) {
        res.status(500).send("Something went wrong: " + err.message);
    }
});

authRouter.post("/logout", (req, res)=>{
    res.cookie("token", null, {
        expires: new Date(Date.now())
    })
    res.send("logout successfull");
})

module.exports=authRouter;