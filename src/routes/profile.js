const express= require("express");
const { userAuth } = require("../utils/auth");

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

module.exports=profileRouter;