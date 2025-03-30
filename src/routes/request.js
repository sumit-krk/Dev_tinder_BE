const express=require("express");
const { userAuth } = require("../utils/auth");
const connectionRequestModel = require("../models/connectionRequest");
const { User } = require("../models/user");
const requestRouter=express.Router();
requestRouter.post("/request/send/:status/:userId", userAuth, async(req, res)=>{
    try{
        const fromUserId=req.user._id;
        const toUserId=req.params.userId;
        const status=req.params.status;
        const allowedStatus=["ignored", "interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "Invalid status type"+ status});
        }
        const toUser=await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({message:"User not found"});
        }
        const existingConnectionRequest=await connectionRequestModel.findOne({
            $or:[
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId},
            ],
        });
        if(existingConnectionRequest){
            return res.status(400).send({message: "Connection Request already Exists!!"});
        }
        const connectionRequest=new connectionRequestModel({
            fromUserId,
            toUserId,
            status
        });
        const data=await connectionRequest.save();
        res.json({
            message:"Connection Request Sent Successfully!",
            data,
        })
    }catch(err){
        res.status(400).send(err.message);
    }
})
module.exports=requestRouter;