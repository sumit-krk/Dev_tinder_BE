const mongoose= require("mongoose");

const connectionRequestSchema= new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // refrence ti the user collection
        required: true
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // refrence ti the user collection
        required: true
    },
    status: {
        type: String,
        required: true,
        enum:{
            values:["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        }
    }
},
{
    timestamps: true,
})

connectionRequestSchema.index({fromUserId:1, toUserId:1})

connectionRequestSchema.pre("save", function (next){
    const connectionRequest=this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request yourself!");
    }
    next();
})

const connectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema)

module.exports=connectionRequestModel;