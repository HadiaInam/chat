import React, { useContext, useEffect, useState } from 'react'
import './Chat.css'
import ChatBox from '../../components/ChatBox/ChatBox.jsx'
import RightSidebar from '../../components/RightSidebar/RightSidebar.jsx'
import LeftSidebar from '../../components/LeftSidebar/LeftSidebar.jsx'
import { Context } from '../../context/ContextProvider.jsx'
import AddChat from '../../components/AddChat/AddChat.jsx'

const Chat = () => {

  const {token} = useContext(Context)
  const [showAdd, setShowAdd] = useState(false)
  const [showright, setShowRight] = useState(false)


  if(!token) {
    return null
  }




  return (
    <div className='chat'>
        <div className={`chat-container ${showright && 'show-right'}`}>
            <LeftSidebar setShowAdd={setShowAdd} />
            {showAdd ? <AddChat /> : <ChatBox setShowRight={setShowRight}  />}
            { showright && <RightSidebar showright={showright} /> }
        </div>
  
    </div>
  )
}

export default Chat