import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true, "Please enter your name"],
    },
    email:{
        type: String,
        required:[true,"Please enter your email"],
        unique:true,
        validate:validator.isEmail,

    },
    password: {
        type: String,
        required:[true,"Please enter your password"],
        minLength:[12,"Password must be at least 12 characters"],
        select: false,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    subscription: {
        id: String,
        status: String,
    },
    avatar: {
        public_id: {
            type: String,
            required:true,
        },
        url: {
            type: String,
            required : true,
        },
    },
    playlist:[
        {
            course:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"Course",
            },
            poster: String,
        },
    ],
    createdAt:{
        type: Date,
        default: Date.now,
    },
    ResetPasswordToken: String,
    ResetPasswordExpire: String, 

});

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();

});
userSchema.methods.getJWTToken = function() {
    return jwt.sign({_id: this._id},process.env.JWT_SECRET,{
        expiresIn:"15d",
    });
};
userSchema.methods.comparePassword = async function(password) {
    console.log(this.password)
    return await bcrypt.compare(password,this.password);
};

userSchema.methods.getResetToken = function(){
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken.digest("hex"));
    this.ResetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;

}
const User = mongoose.model("User",userSchema);
export default User;