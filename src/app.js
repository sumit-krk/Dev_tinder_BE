// step-1. - creating server
const express = require("express");
const { connectDB } = require("./config/database");
require("./config/database");
const {User} = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt=require("bcrypt");
const app = express();
const cookieParser=require("cookie-parser");
const { userAuth } = require("./utils/auth");
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
   //creating new instance of the user model
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

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user
        if (!user) {
            throw new Error("User not found");
        }
        else {
            res.send(user);
        }
    } catch (err) {
        throw new Error(err.message);
    }
})

app.get("/user", async (req, res) => {
    try {
        const mailId=req.body.emailId;
        const user = await User.find({emailId: mailId})
        if(user.length===0){
            throw new Error("User not found!")
        }
        else{
            res.status(200).send(user);
        }
    } catch (err) {
        res.status(404).send({message: err.message});
    }
})

app.delete("/user", async (req, res) => {
    const UserId = req.body.UserId;
    try {
        const deletedUser = await User.findByIdAndDelete(UserId);
        if (!deletedUser) {
            return res.status(404).send("User not found");
        }
        res.send("User deleted successfully...");
    } catch (err) {
        res.status(500).send("Error while deleting user");
    }
});

app.patch("/user/:userId", async(req, res)=>{
    const userId=req.params?.userId;
    const updateData=req.body;
    try{
        const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
        const isUpdateAllowed= Object.keys(updateData).every((k)=>{
            ALLOWED_UPDATES.includes(k)
        })
        if(!isUpdateAllowed){
            throw new Error("Update not allowed");
        }
        const data=await User.findByIdAndUpdate({_id:userId}, updateData, {returnDocument:'before', runValidators: true})
        console.log("Data before updated", data)
        res.send("Data updated Successfully...")
    }catch(err){
        res.status(400).send("Something went wrong while updating...")
    }
});

connectDB().then(() => {
    console.log("Database connection established....")
    app.listen(5000, () => {
        console.log("server listning on 5000")
    })
}).catch((err) => {
    console.log("Database cannot be connected!!");
})
