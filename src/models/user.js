const mongoose=require("mongoose");
const validator=require("validator");
const jwt = require("jsonwebtoken");
const bcrypt=require("bcrypt");

const userSchema=mongoose.Schema({
    firstName:{
        type: String,
        required: [true, "First name is required"],
        minLength: [2, "First name must be at least 2 characters"],
        maxLength: [50, "First name cannot exceed 50 characters"]
    },
    lastName:{
        type:String,
    },
    emailId:{
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){   // example of email validation using validator package.
            if(!validator.isEmail(value)){
                throw new Error ("Email is not valid" + value)
            }
        }
    },
    password:{
        type: String,
        required: [true, "Password is required"],
    },
    age:{
        type: Number,
        // required: [true, "Age is required"],
        min:18
    },
    gender:{
        type:String,
        validate(value){    //example of custom validation function
            if(!["male", "female", "other"].includes(value)){
                throw new Error("Gender Data is not valid");
            }
        }
    },
    skills:{
        type: [String],
    },
    about:{
        type:String,
        default: "This is a default about the user",
    },
    photoUrl:{
        type: String
    }
}, {timestamps: true})

userSchema.methods.getJWT= async function(){
    const user=this;
    const token= await jwt.sign({_id: user._id}, "DEV@Tinder$790", {
        expiresIn: "7d",
    })
    return token;
}

userSchema.methods.validatePassword= async function (passwordInputByUser){
    const user=this;
    const passwordHash= user.password;
    const isPasswordValid= await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;
}

const User=mongoose.model("User", userSchema);

module.exports={User}

// const User=mongoose.model("User", userSchema);
// module.exports={User}