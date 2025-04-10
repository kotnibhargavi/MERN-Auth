import React, {useContext,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import {assets} from '../assets/assets'
import axios from 'axios'
import {AppContext} from '../context/AppContext'
import {toast} from 'react-toastify'


const EmailVerify = () => {
  const {backendUrl,isLoggedIn,userData,getUserData} = useContext(AppContext)
  axios.defaults.withCredentials = true
  const navigate = useNavigate()
  const inputRefs = React.useRef([])
  const handleInput = (e,index)=>{
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1){
      inputRefs.current[index + 1].focus()
    }
  }
  const handleKeyDown = (e,index)=>{
    if (e.key === "Backspace" && inputRefs.current[index].value === "" && index > 0){
      inputRefs.current[index - 1].focus()
    }
  }
  const handlePaste = (e)=>{
    
    const text = e.clipboardData.getData("text/plain")
    const values = text.split("")
    // for (let i = 0; i < values.length; i++){
    //   inputRefs.current[i].value = values[i]
    // }
    values.forEach((value,index)=>{
      inputRefs.current[index].value = value
    })

    
  }
  const onSubmitHandler = async (e)=>{
    e.preventDefault()
   try {
    
    const otp = inputRefs.current.map(input => input.value).join("")
    const {data} = await axios.post(backendUrl+ '/api/auth/verify-otp',{otp})

    if (data.success){
      toast.success(data.message)
      getUserData()
      navigate("/")
    }else{
      toast.error(data.message)
    }

   } catch (error) {
    toast.error(error.response.data.message)
   }

  }
  useEffect(()=>{
    isLoggedIn && userData && userData.isVerified && navigate("/")
  },[isLoggedIn,userData])

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'> 
    <img onClick={() => navigate("/")} src={assets.logo} alt="" className='position absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>
        <form className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 sm:w-96 text-indigo-300 text-sm" onSubmit={onSubmitHandler} type = 'submit'>
          <h1 className="text-white text-2xl font-semibold text-center mb-4">Email Verify OTP</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter the 6 digit code   sent to your email id.</p>
          <div className ="flex justify-between mb-8" onPaste = {handlePaste}>
              {Array(6).fill(0).map((_,index)=>(
                  <input type = "text" required maxLength="1" key={index} 
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref = { el => inputRefs.current[index] = el }
                  className = "w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300" />
              ))
              }
              
          </div>
          <button className = "w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer">Verify OTP</button>
        </form>
    </div>
  )
}

export default EmailVerify
