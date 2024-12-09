import React, { useContext, useEffect, useState } from 'react'
import { FiSearch } from "react-icons/fi";
import './AddChat.css'
import { FaPlus } from "react-icons/fa6";
import axios from 'axios'
import { Context } from '../../context/ContextProvider.jsx';

const AddChat = () => {
    const [users, setUsers] = useState([])
    const {token} = useContext(Context)

    const getAllUsers = async() => {
        try{
            const response = await axios.post('http://localhost:4000/api/user/all-users', {})
            if(response.data.success){
                setUsers(response.data.allUsers)

            }
        } catch(error){
            console.log(error)
        }
    }

    const addChat = async(id) => {
        try {
            const tokenresponse = await axios.post('http://localhost:4000/api/user/token-userid', { token })
            const userId = tokenresponse.data.userId
            const response = await axios.post('http://localhost:4000/api/user/add-chat', {id, userId})

            if (response.data.success){
                console.log('Successfully added')
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
       getAllUsers()
    }, [])
  return (
    <div className='addchat'>
        <div className="search">
          <FiSearch className='search-icon' />
          <input type="text" placeholder='Search here...' />
        </div>
        <div className='chats'>
        {users && users.map((user, index) =>(
            <div className="users" key={index}>
            <img src={user.profilePicture} alt="" />
             <div>
                <p className='name'>{user.username}</p>
                <span>{user.bio}</span>
            </div>
            <FaPlus className='add' onClick={() => addChat(user._id)}/>
        </div>
        ))}

        </div>

    </div>
    
  )
}

export default AddChat