import React, { useContext, useEffect } from 'react'
import './RightSidebar.css'
import { GoDotFill } from "react-icons/go";
import { assets } from '../../assets/assets';
import { Context } from '../../context/ContextProvider.jsx';
import { useNavigate } from 'react-router-dom';

const RightSidebar = ({showright}) => {

  const {setToken, currentChat, media} = useContext(Context)
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('token')
    setToken('')
    navigate('/')
}

useEffect(() => {
  if(showright){
    document.getElementById('right').style.display = 'block'

  }
}, [showright])


  return (
    <div className='rs' id='right'>
        <div className="rs-profile">
            <img src={currentChat.profilePicture} alt="" />
            <h3>{currentChat.username} <GoDotFill className='dot' /></h3>
            <p>{currentChat.bio}</p>
        </div>
        <hr />
        <div className="rs-media">
            <p>Media</p>
            <div>
                {media && media.map((item, index) => (
                  <img key={index} src={item.message} />
                ))}
            </div>
        </div>
        <button onClick={logout}>Logout</button>
    </div>
  )
}

export default RightSidebar