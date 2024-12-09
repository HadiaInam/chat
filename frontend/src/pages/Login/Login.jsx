import React, { useContext, useEffect, useState } from 'react'
import './Login.css'
import { assets } from '../../assets/assets.js'
import {toast} from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Context } from '../../context/ContextProvider.jsx'

const Login = () => {

    const [currentState, setCurrentState] = useState('Sign Up')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [formData, setFormData] = useState({})
    const navigate = useNavigate()
    const {setToken, token} = useContext(Context)



    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            if (currentState === 'Sign Up'){
                const response = await axios.post('http://localhost:4000/api/user/signup',{username, email, password})

                if(response.data.success){
                    navigate('chat')
                    setUsername('')
                    setEmail('')
                    setPassword('')
                    setToken(response.data.token)
                    localStorage.setItem('token',response.data.token)
                }


               
            } else{
                const response = await axios.post('http://localhost:4000/api/user/signin',{email, password})

                if(response.data.success){
                    navigate('chat')
                    setUsername('')
                    setEmail('')
                    setPassword('')
                    setToken(response.data.token)
                    localStorage.setItem('token',response.data.token)
                }
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    useEffect(() => {
        if(!token && localStorage.getItem('token')){
          setToken(localStorage.getItem('token'))
        }
      })
  return (
    <div className='login'>
        <img src={assets.biglogo} alt="" className='logo'/>
        <form onSubmit={onSubmitHandler} className="login-form">
            <h2>{currentState}</h2>
            {currentState === 'Sign Up' ? <input onChange={(e) => setUsername(e.target.value)} type="text" placeholder='Username' className='form-input' required /> : null}
            <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Email Address' className='form-input' required />
            <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Password' className='form-input' required />
            <button type='submit'>{currentState === 'Sign Up'? 'Create Account' : currentState}</button>
            <div className="login-term">
                <input type="checkbox" />
                <p>Agree to the terms of use & privacy policy</p>
            </div>
            <div className="login-forgot">
                <p className="login-toggle">{currentState === 'Sign Up'? 'Already have an account? ': "Don't have an account? "}<span onClick={() => {currentState === 'Sign Up' ? setCurrentState('Sign In'): setCurrentState('Sign Up')}}>{currentState === 'Sign Up'? 'Sign In' : 'Create account'}</span></p>
            </div>
        </form>
    </div>
  )
}

export default Login