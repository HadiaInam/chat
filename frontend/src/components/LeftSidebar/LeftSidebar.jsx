import React, { useContext, useEffect, useState } from 'react'
import './LeftSidebar.css'
import { assets } from '../../assets/assets'
import { HiDotsVertical } from "react-icons/hi";
import { TiUserAddOutline } from "react-icons/ti";
import axios from 'axios'
import { Context } from '../../context/ContextProvider.jsx';
import { useNavigate } from 'react-router-dom';


const LeftSidebar = ({ setShowAdd }) => {

  const [chatsId, setChatsId] = useState(false)
  const [chats, setChats] = useState([])
  const { token, setCurrentChat, navigate, setGoToProfile, gotochat, setCurrentId, currentId } = useContext(Context)

  const getUserChats = async () => {
    try {
      const tokenresponse = await axios.post('http://localhost:4000/api/user/token-userid', { token })
      const userId = tokenresponse.data.userId
      const response = await axios.post('http://localhost:4000/api/user/get-chats', { userId }, { headers: { token } })
      setChatsId(response.data.id)
    } catch (error) {
      console.log(error)
    }
  }

  const getUser = async (chat) => {
    try {
        const response = await axios.post('http://localhost:4000/api/user/get-user', {id:chat}, {headers: {token}})
        if(response.data.success){
            setChats((prev) => [...prev, response.data.user])
            
        }
    } catch (error) {
        console.log(error)
    }
}

  useEffect(() => {
    getUserChats()
    setChats('')
  }, [])

  useEffect(() => {
    setChats('')
    for(const chat in chatsId){
      getUser(chatsId[chat])
    }
  }, [chatsId])

  return (
    <div className='ls'>
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} className='logo' alt="" />
          <div className='side'>
            <TiUserAddOutline className='add-icon' onClick={() => setShowAdd(true)} />
            <div className="menu">
              <HiDotsVertical className='menu-icon' />
              <div className="sub-menu">
                <p className="" onClick={() => { setGoToProfile(true) }} >Edit Profile</p>
                <hr />
                <p className="">Logout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="ls-list">
        {chats && chats.map((chat, index) => (
          <div key={index} className="friends" onClick={() => {
            setCurrentId(chat._id)
          }
          }>
            <img src={chat.profilePicture} alt="" />
            <div>
              <p>{chat.username}</p>
              <span>{chat.bio}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LeftSidebar