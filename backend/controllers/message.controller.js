import Message from "../models/message.model.js";
import { io } from "../server.js";
import {v2 as cloudinary} from  'cloudinary'

export const getMessages = async(req,res)=>{
    const {senderId, recieverId} = req.body;
     try {
        const messages = await Message.find({
            $or: [
              { senderId: senderId, recieverId: recieverId },
              { senderId: recieverId, recieverId: senderId }
            ]
          }).sort({ createdAt: -1 }); // 1 for ascending, -1 for descending

         res.json({success: true, messages})
     } catch (error) {
        console.log(error)
     }

}
export const addMessage = async(req,res)=>{
    const{senderId, recieverId, time, type, message} = req.body;
    try{
        if(!message || message===""){
            res.json({success:false, message: 'Cannot send empty fields'})
        }
        const newMessage = new Message({
            message,
            senderId,
            recieverId,
            time,
            type
        })
        await newMessage.save();
        io.to(recieverId).emit("recieve_message", newMessage);
        res.json({newMessage, success: true})

    } catch(error){
        res.json({message:error.message, success:false})
    }

}
const upload = async (file) => {
    const result = await cloudinary.uploader.upload(file, {
        resource_type: 'image', 
    });
    return result.secure_url;
}

export const addImage = async (req,res) => {
    const{senderId, recieverId, time, type} = req.body;
    const message = req.files.message && req.files.message[0]
    
    try {
        if(!message || message===""){
            res.json({success:false, message: 'Cannot send empty fields'})
        }
        let image = await upload(message.path)
        const newMessage = new Message({
            message:image,
            senderId,
            recieverId,
            time,
            type
        })
        await newMessage.save();
        io.to(recieverId).emit("recieve_message", newMessage);
        res.json({success:true, newMessage})
      } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
      }
    
}