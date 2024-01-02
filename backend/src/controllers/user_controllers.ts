import { Request, Response, NextFunction} from 'express';
import User from "../models/User.js";
import { hash, compare } from 'bcrypt';
import { createToken } from '../utils/token_manager.js';
import { COOKIE_NAME } from '../utils/constants.js';

export const getAllUsers = async( 
    req:Request, 
    res:Response,
    next:NextFunction
    ) => {
    try {
        //get all users
        const users = await User.find();
        return res.status(200).json({message:"OK", users});
    } catch (error) {
        return res.status(200).json({message:"Error", cause:error.message})
        
    }
}

export const userSignup = async( 
    req:Request, 
    res:Response,
    next:NextFunction
    ) => {
    try {
        const {name, email, password} = req.body;
        const existingUser = await User.findOne({email});
        if (existingUser) return res.status(402).send("User Already Registered");
        const hashedPassword = await hash(password, 10);
        const user = new User({name, email, password : hashedPassword});
        await user.save();

        //create token and store cookie
        res.clearCookie(COOKIE_NAME,{
            httpOnly:true,
            domain:"localhost",
            signed:true,
            path:"/",
        })


        //creating token
        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate()+7);
        //set cookies
        res.cookie("auth_token", token, {
            path:"/", 
            domain:"localhost", 
            expires,
            httpOnly:true,
            signed:true,
        });
        
        return res.status(201).json({message:"User Saved", name:user.name, email:user.email });
    } catch (error) {
        return res.status(200).json({message:"Error", cause:error.message})
        
    }
}

export const userLogin = async( 
    req:Request, 
    res:Response,
    next:NextFunction
    ) => {
    try {
        const { email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).send("User not Registered");
        }

        const isPasswordCorrect = await compare(password, user.password);
        if (!isPasswordCorrect){
            return res.status(403).send("Incorrect Password");
        }

        //clearing old cookie
        res.clearCookie(COOKIE_NAME,{
            httpOnly:true,
            domain:"localhost",
            signed:true,
            path:"/",
        })


        //creating token
        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate()+7);
        //set cookies
        res.cookie("auth_token", token, {
            path:"/", 
            domain:"localhost", 
            expires,
            httpOnly:true,
            signed:true,
        });

        return res.status(200).json({message:"Login Successful", name:user.name, email:user.email });


    } catch (error) {
        return res.status(200).json({message:"Error", cause:error.message})
        
    }
}

export const verifyUser = async( 
    req:Request, 
    res:Response,
    next:NextFunction
    ) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if(!user){
            return res.status(401).send("User not Registered");
        }
        if(user._id.toString()!==res.locals.jwtData.id){
            return res.status(401).send("Permissions didnt match");
        }

        return res.status(200).json({message:"OK", name:user.name, email:user.email });


    } catch (error) {
        return res.status(200).json({message:"Error", cause:error.message})
        
    }
}