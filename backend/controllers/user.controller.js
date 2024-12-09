import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
 


const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}

export const signup = async (req, res, next ) => {

    const {username, email, password} = req.body;
    if (!username || !email || !password || username==="" || email=== "" || password ===""){
        return(res.json({message:'All feilds required', success: false}))
    }
    
    const hashedPassword = bcryptjs.hashSync(password, 10)
    
    const newUser = new User({
       username,
       email,
       password: hashedPassword,
    });
    try{
        await newUser.save();
        const token = createToken(newUser._id)
        return(res.json({token, success: true}))
    } catch(error){
        next(error);
    }
    
};

export const signin = async (req, res, next ) => {

    const {email, password} = req.body;

    if(!email || !password || email === "" || password === "" ){
        return(res.json({success: false, message: 'All fields are required!'}));
    }

    try{
        const validUser = await User.findOne({email});

        if(!validUser){
            return(res.json({success: false, message: 'Invalid email/password'}));
        };
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if(!validPassword){
            return(res.json({success: false, message: 'Invalid email/password'}));
        };

        if(validUser && validPassword){
            const token = createToken(validUser._id)
            res.json({success:true, token})
        }
        else {
            res.json({success:false, message: 'Invalid credentials'})
        }

    } catch(error){
        next(error)
    };
};

export const getUserIdFromToken = async(req,res,next) => {

    const {token} = req.body;

    const decoded = jwt.decode(token, { complete: true }); // Decodes without verification
    if(!token) {
        return res.json({success: false, message: 'Not authorised try again'})
    }

    try {
        const userId = decoded.payload.id
        res.json({userId})
    } catch (error) {
        console.log(error)
        next(error)
    }

   

}

export const getUserChats = async(req,res) =>  {
    try {
        const {userId} = req.body;
        const user = await User.findById(userId);
        const id = user.chats
        res.json({success: true, id})
    } catch (error) {
        console.log(error)
        res.json({success: false})
    }

}
export const addChats = async(req, res) => {
    const {userId, id} = req.body;
    

    try {

        const user = await User.findById(userId);
        const user2 = await User.findById(id);
        const user1_chats = user.chats
        const user2_chats = user2.chats

        let chats = [...user1_chats, id ]
        await User.findByIdAndUpdate(userId ,{chats})

        
        
        chats = [...user2_chats, userId ]
        await User.findByIdAndUpdate(id ,{chats})
        
        res.json({success: true})

    } catch (error) {
        console.log(error)
    }
}

export const getAllUsers = async (req,res) => {
    try {
        const allUsers = await User.find({})
        res.json({success:true, allUsers})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

const upload = async (file) => {
    const result = await cloudinary.uploader.upload(file, {
        resource_type: 'image', 
    });
    return result.secure_url;
}
export const updateUser = async (req, res) => {

    const {userId, username, bio} = req.body
    const profilePicture = req.files.profilePicture && req.files.profilePicture[0]
        try {
            let image = await upload(profilePicture.path)
            const updatedUser = await User.findByIdAndUpdate(
              userId,
              {
                $set: {
                  username,
                  bio,
                  profilePicture: image,
                },
              },
              { new: true }
            );
            await updatedUser.save()
            res.json({success:true, message:'User Updated'})
          } catch (error) {
            console.log(error)
            res.json({success: false, message: error.message})
          }
        };

export const userInfo = async (req,res) => {
    const {id} = req.body

    try {
        const user = await User.findById(id)
        res.json({success: true, user})

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}