import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
export const register = async(req,res)=>{
    try{
   const {username,email,password} = req.body;
   //Hash the Password
   const hashpAssword =await bcrypt.hash(password,8);
   //Create a new Database User and Save it to const {propertyName} = objectToDestruct
   const  newUser = await prisma.user.create({
   data:{
        username,
        email,
        password:hashpAssword,
   },
   });
    res.status(201).json({
    message:"User created Succesfully"
    })
}catch(err){
    console.log(err);
    res.status(500).json({
        message:"Failed Creating User"
    });
}
};
export const login = async(req,res)=>{
   const{username,password}=req.body;
   try{
   //Check if the User Exists
   const user= await prisma.user.findUnique({
    where:{username}
   }) 
   if(!user){
    return res.status(401).json({
        message:"Inavalid Credentials!"
    });
   }
   //check ifthe password is correct
   const isPassWordValid= await bcrypt.compare(password,user.password);
   if(!isPassWordValid) {
    return res.status(401).json({
        message:"Inavalid Credentials!"
    })
   }
   //Generate Cookie token and Send it to the user
   console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY);
   const age= 1000*60*60*24*7;
   const token = jwt.sign({
      id: user.id,
      isAdmin: user.role === "ADMIN",
   }, process.env.JWT_SECRET_KEY, { expiresIn: age });
   const {password:userPassword,...userInfo}=user;
   
   res.cookie("token",token,{
    httpOnly:true,
    maxAge:age,
   }).json(userInfo); 
    
}catch(err){
    console.log(err);
    res.status(500).json({
        message:"Failed to Login"
    })
}
};
export const logout = async(req,res)=>{
    res.clearCookie("token").status(200).json({
        message:"Logout Succesfull"
    })
}