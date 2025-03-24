const express= require("express");
const { userAuth } = require("../utils/auth");
const { validationEditProfileData } = require("../utils/validation");
const { User } = require("../models/user");

const profileRouter=express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
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

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if(!validationEditProfileData(req)){
            throw new Error("Invalid Edit Request");
        }
        const loggedinUser=req.user;
        Object.keys(req.body).forEach((key)=> (loggedinUser[key] = req.body[key]))
        await new User(loggedinUser).save();
        res.send({message:"Edited successfully..", data:loggedinUser})

    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports=profileRouter;