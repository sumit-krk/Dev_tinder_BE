const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const verifyUser = async (req, res, next) => {
    const token = req.cookies;
    try {
        if (!token) {
            return res.status(401).send("Unauthorized: No token provided");
        }
        const getUserBasedOnToken = await jwt.verify(token,)
        const { _id } = getUserBasedOnToken;
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User not found")
        }
        req.user = user
        next();
    } catch (err) {
        res.status(401).send("Something went Wrong", err.message)
    }
}