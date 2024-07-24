import { Schema, model } from 'mongoose';
import { resetPassword } from '../controllers/userController.js';

const userSchema = new Schema({
    firstName:{
        type: String,
        required: true,
        trim:true
    },
    lastName:{
        type: String,
        required: true,
        trim:true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim:true
    },
    userName:{
        type: String,
        required: true,
        unique: true,
        trim:true
    },
    password:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
})

const User = model('User', userSchema);

export default User;