import express from 'express'
import mongoose from 'mongoose';

import cors from 'cors'
import userRoutes from './routes/user.route.js'
import messageRoutes from './routes/message.route.js'
import http from "http"
import {Server} from "socket.io";
import connectCloudinary from './utils/cloudinary.js';

import dotenv from 'dotenv';

dotenv.config(); 

const app = express()
app.use(express.json())
app.use(cors())
 
const server = http.createServer(app)

export const io = new Server(server, {
    cors: {
        origin: process.env.ORIGIN,
        methods: ["GET", "POST"],
    }
});

mongoose.connect(
    process.env.MONGO
).then(
    () => {
        console.log("Mongo connected")
    }
).catch((err) => {
    console.log(err)
})

connectCloudinary()
app.use('/api/user', userRoutes);
app.use('/api/message', messageRoutes);


io.on("connection", (socket) => {
    console.log(`Socket Connected: ${socket.id}`)

    socket.on("send_message", (data) => {
        const { recieverId } = data;
        socket.to(recieverId).emit("recieve_message", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });

} )

server.listen(4000, () => {
    console.log('Server running on port 4000!');
});

app.get('/', (req,res) => {
    res.send("API working")
})