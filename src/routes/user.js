const express=require("express");
const { User } = require("../models/user");
const { userAuth } = require("../utils/auth");
const connectionRequestModel = require("../models/connectionRequest");
const userRouter=express.Router();

const USER_SAFE_DATA="firstName lastName photoUrl age gender about skills";

userRouter.get("/user/request/recived", userAuth, async(req, res)=>{
    try{
        const loggedInUser=req.user;
        const connectionRequest=await connectionRequestModel.find({
            toUserId:loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl"]);

        res.json({
            message:'Data fetched successfully',
            data: connectionRequest
        })
    }catch(err){

    }
})

userRouter.get("/user/connection", userAuth, async(req, res)=>{
    try{
        const loggedInUser=req.user;
        const connectionRequest=await connectionRequestModel.find({
            $or:[
                {toUserId: loggedInUser._id, status:"accepted"},
                {fromUserId: loggedInUser._id, status:"accepted"}
            ]
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl"])
          .populate("toUserId", ["firstName", "lastName", "photoUrl"])
        const data=connectionRequest.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });
        res.json({data})
    }catch(err){
        res.status(400).send({message: err.message})
    }
})

userRouter.get("/feed", userAuth, async(req, res)=>{
    try{
        //user should see all the user cards except
        // 0- his own card
        // 1- his connections
        // 2- ignored people
        // 3- already sent the connection request
        const loggedInUser = req.user;

        const page=parseInt(req.query.page) || 1;
        let limit=parseInt(req.query.limit) || 10;
        limit=limit>50?50:limit;

        const skip=(page-1)*limit;
        // find all connection request (sent + recived)
        const connectionRequest=await connectionRequestModel.find({
            $or : [{fromUserId: loggedInUser._id}, {toUserId: loggedInUser._id}],
        }).select("fromUserId toUserId");
        const hideUsersFromFeed= new Set();
        connectionRequest.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });
        const user=await User.find({
            $and:[
                {_id: {$nin: Array.from(hideUsersFromFeed)}},
                {_id: {$ne:loggedInUser._id}},
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);
        res.send(user);
    }catch(err){
        res.status(400).json({message: err.message});
    }
})

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