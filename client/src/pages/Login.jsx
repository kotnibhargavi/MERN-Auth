import React, {useState, useContext} from 'react'
import {assets} from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import {toast} from 'react-toastify'
import axios from 'axios'



const Login = () => {
const [state, setState] = useState("Sign Up")
const [name, setName] = useState("")
const [email, setEmail] = useState("")
const [password, setPassword] = useState("")
const navigate = useNavigate()
const {backendUrl, setIsLoggedIn, getUserData} = useContext(AppContext)
const onSubmitHandler = async (e) => {
    try {
        e.preventDefault()
        axios.defaults.withCredentials = true
        if (state === "Sign Up") {
        const {data} = await axios.post(backendUrl+"/api/auth/register", {name, email, password})
        if (data.success) {
            setIsLoggedIn(true)
            getUserData()
            navigate("/")
            toast.success(data.message)
        }else{
            toast.error(data.message)
        }
        
        }else {
            if (state === "Login") {
                const {data} = await axios.post(backendUrl+"/api/auth/login", {email, password})
                if (data.success) {
                    setIsLoggedIn(true)
                    getUserData()
                    navigate("/")
                    toast.success(data.message)
                }else{
                    toast.error(data.message)
                }
                
                }

        }

    } catch (error) {
        toast.error(error.response.data.message)
    }

}
  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'> 
    <img onClick={() => navigate("/")} src={assets.logo} alt="" className='position absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>
    <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">

        <h2 className='text-3xl font-semibold text-white text-center mb-3'
        >{state === "Sign Up" ? "Create Account" : "Login"}</h2>
        <p className='text-center text-sm mb-6'>
        {state === "Sign Up" ? "Create your account" : "Login to your account!"}
        </p>
    
    <form onSubmit={onSubmitHandler}>
        {state === "Sign Up" && (
        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.person_icon} alt="" className='w-5 h-5'/>
            <input value={name} onChange={(e) => setName(e.target.value)} type= "text" placeholder='Full Name' required className='bg-transparent outline-none' />
        </div>
        )}
        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" className='w-5 h-5'/>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type= "email" placeholder='Email-Id' required className='bg-transparent outline-none' /> 
        </div>
        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" className='w-5 h-5'/>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type= "password" placeholder='Password' required className='bg-transparent outline-none' />
        </div>
        <p className='mb-4 text-indigo-500 cursor-pointer' onClick={() => navigate("/reset-password")}>Forgot Password?</p>
        <button type='submit' className='cursor-pointer w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'>
        {state}
        </button> 
    </form>
    {state=== "Sign Up"? (<p className='text-gray-400 text-center text-xs mt-4'>Already have an account?{' '}
        <span className='text-blue-400 cursor-pointer underline' onClick={() => setState("Login")}>Login here</span>
    </p>):(<p className='text-gray-400 text-center text-xs mt-4'>Don't have an account?{' '}
            <span className='text-blue-400 cursor-pointer underline' onClick={() => setState("Sign Up")}>Sign Up</span>
        </p>)}
    
        

    </div>
    </div>
  )
}

export default Login
