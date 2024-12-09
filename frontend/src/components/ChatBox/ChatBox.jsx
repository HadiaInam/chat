import React, { useContext, useEffect, useState } from 'react'
import './ChatBox.css'
import { GoDotFill } from "react-icons/go";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoIosSend } from "react-icons/io";
import { MdOutlinePhoto } from "react-icons/md";
import { assets } from '../../assets/assets.js';
import io from 'socket.io-client'
import axios from 'axios'
import { Context } from '../../context/ContextProvider.jsx';

const socket = io.connect('http://localhost:4000')
const backendUrl = import.meta.env.BACKEND_URL


const ChatBox = ({setShowRight}) => {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [type, setType] = useState('message')
    const { currentChat, senderId, recieverId, token, setMedia, media} = useContext(Context)
    const [user, setUser] = useState(false)

    const getMessages = async () => {

        try {
            const response = await axios.post('http://localhost:4000/api/message/get-messages', { senderId, recieverId }, { headers: { token } })
            if (response.data.success) {
                setMessages(response.data.messages)
                setMedia(response.data.messages.filter((item) => item.type !== 'message'))
                
            }
        } catch (error) {
            console.log(error.message)
        }
    }
    const getUser = async () => {
        try {
            const tokenresponse = await axios.post('http://localhost:4000/api/user/token-userid', { token })
            const tokensenderId = tokenresponse.data.userId

            const response = await axios.post('http://localhost:4000/api/user/get-user', {id:tokensenderId}, {headers: {token}})
            if(response.data.success){
                setUser(response.data.user)
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getMessages()
        getUser()
        
    }, [senderId, recieverId])


    const sendMessage = async () => {
        try {
            const timestamp = Date.now();
            const date = new Date(timestamp);
            const hours = String(date.getHours())
            const minutes = String(date.getMinutes())
            const time = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`
            if (type === 'message'){
                const response = await axios.post('http://localhost:4000/api/message/add-message', { message, senderId, recieverId, time, type }, { headers: { token } })
                if (response.data.success) {
                    addMessage(response.data.newMessage)
                    setMessage('')
                }
            }
            if (type === 'image') {
                const formData = new FormData();
            formData.append("message", message);
            formData.append("senderId", senderId);
            formData.append("recieverId", recieverId);
            formData.append("time", time);
            formData.append("type", type);
             const response = await axios.post('http://localhost:4000/api/message/add-image', formData, { headers: { token } })
             if (response.data.success) {
                addMessage(response.data.newMessage)
                 setMessage('')
             }
            }
            

            socket.emit("send_message", { message, token, senderId, recieverId, type }
            )
        } catch (error) {
            console.log(error)
        }
    }

    const addMessage =async(data) => {
        setMessages((prevMessages) => [data, ...prevMessages]);
        setMedia((prev) => [(data.type !== 'message' && data  ), ...prev])
    };


    useEffect(() => {
        if (!socket) return; // Avoid running if socket is undefined

        const handleReceiveMessage = async (data) => {
            addMessage(data);
        };

        // Add the listener
        socket.on("recieve_message", handleReceiveMessage);

        // Cleanup on unmount or when `socket` changes
        return () => {
            socket.off("recieve_message", handleReceiveMessage);
        };
    }, [socket]);

    console.log('rendered')



    return (
        <div className='chat-box'>
            <div className="chat-user">
                <img src={currentChat.profilePicture} alt="" />
                <p>{currentChat.username} <GoDotFill className='dot' /></p>
                <IoIosInformationCircleOutline className='help' onClick={() => setShowRight((prev) => (!prev))} />
            </div>

            <div className='chat-message'>
                {messages && messages.map((msg, index) => (
                    <div key={index}>
                        <div className={senderId === msg.senderId ? 's-msg' : 'r-msg'}>
                            { msg.type === "image" ? <img className='msg-img' src={msg.message}/> : <p className="message">{msg.message}</p>}
                            <div>
                                < img src={currentChat._id === msg.recieverId ? user.profilePicture : currentChat.profilePicture} alt="" />
                                <p>{msg.time}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input type="text" placeholder='Send a message'  onClick={() => setType('message')} onChange={(e) => setMessage(e.target.value)}   value={message} />
                <input type="file" id='image' accept='image/png, image/jpeg' hidden onChange={(e) => setMessage(e.target.files[0])} />
                <label htmlFor="image" >
                    <MdOutlinePhoto className='img'  onClick={() => setType('image')}  />
                </label>
                <IoIosSend className='send img' onClick={sendMessage} />
            </div>
        </div>
    )
}

export default ChatBox