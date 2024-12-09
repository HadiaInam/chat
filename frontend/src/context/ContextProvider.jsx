import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

export const Context = createContext();

const ContextProvider = (props) => {
    const [token,setToken] = useState('')
    const [currentChat, setCurrentChat] = useState(false)
    const [senderId, setSenderId] = useState('')
    const [recieverId, setRecieverId] = useState('')
    const [gotochat, setGoToChat] = useState(false)
    const [gotoprofile, setGoToProfile] = useState(false)
    const [currentId, setCurrentId ] = useState(false)
    const [media, setMedia] = useState([])

    const navigate = useNavigate()

    const setUser = async () => {
        const tokenresponse = await axios.post('http://localhost:4000/api/user/token-userid', { token })
        const tokensenderId = tokenresponse.data.userId
        setSenderId(tokensenderId)

    }
    

    useEffect(() => {
        if (!token && localStorage.getItem('token')){
            setToken(localStorage.getItem('token'))
        }
    }, [])

    const setChat = async () => {
        try {
            const response = await axios.post('http://localhost:4000/api/user/get-user', {id:currentId}, {headers: {token}})
            if(response.data.success){
                setCurrentChat(response.data.user)
                setRecieverId(response.data.user._id)
            }
           
        } catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {
       setChat()
       setUser()
    }, [currentId])

    useEffect(() => {
        navigate('profile')
        setGoToProfile(false)
    }, [gotoprofile])

    useEffect(() => {
        navigate('chat')
        setGoToChat(false)
    }, [gotochat])

    const value = {
        token,
        setToken,
        currentChat,
        setCurrentChat,
        senderId,
        setSenderId,
        recieverId,
        setRecieverId,
        navigate, setGoToChat, gotochat,
        gotoprofile, setGoToProfile,
        setCurrentId, currentId,
        media, setMedia

    }

    return ( 
        <Context.Provider value={value} >
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider