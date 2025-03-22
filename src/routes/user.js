const express=require("express");
const { User } = require("../models/user");
const userRouter=express.Router();

userRouter.get("/user", async (req, res) => {
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

userRouter.delete("/user", async (req, res) => {
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

userRouter.patch("/user/:userId", async(req, res)=>{
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

module.exports=userRouter;