import React, { useContext, useEffect, useState } from 'react'
import './ProfileUpdate.css'
import { FaUserCircle } from "react-icons/fa";
import { assets } from '../../assets/assets';
import { Context } from '../../context/ContextProvider.jsx';
import axios from 'axios'

const ProfileUpdate = () => {

    const [image, setImage] = useState('')
    const [username, setUsername] = useState('')
    const [bio, setBio] = useState('')
    const {setGoToChat, setGoToProfile, token} = useContext(Context)
    const [user, setUser] = useState({})


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



    useEffect(()=> {
        if(setGoToProfile){
            getUser()
        }
}, [setGoToProfile])

useEffect(() => {
    if (user.username){
        setUsername(user.username) 
    }
    if(user.bio){
     setBio(user.bio)
    }
    if (user.profilePicture){
        setImage(user.profilePicture)
    }
  }, [user]);
    
    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {

            const formData = new FormData();
            formData.append("userId", user._id);
            formData.append("username", username);
            formData.append("bio", bio);
            formData.append("profilePicture", image);

            const response = await axios.post('http://localhost:4000/api/user/update', formData, {headers:{token}})
            console.log(response.data)
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div className='profile'>
        <div className="profile-container">
            <form action="" onSubmit={onSubmitHandler}>
                <h3>Profile Details</h3>
                <label htmlFor="avatar">
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden />
                    {image ? <img className='user' src={URL.createObjectURL(image)}/> : <img src=''/> }
                    Upload Profile Image
                </label>
                <input type="text" placeholder='Your Name' required value={username} onChange={(e)=> setUsername(e.target.value)}  />
                <textarea placeholder='Write profile bio' value={bio} required onChange={(e)=> setBio(e.target.value)} ></textarea>
                <button type='submit'>Save</button>
            </form>
            {image ? <img className='profile-pic' src={URL.createObjectURL(image)}/> : <img src=''/> }
            <p className='close' onClick={()=>setGoToChat(true)}>x</p>
        </div>
    </div>
  )
}

export default ProfileUpdate