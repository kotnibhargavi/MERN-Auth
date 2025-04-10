import React from 'react'
import { useNavigate } from 'react-router-dom'
import {assets} from '../assets/assets'
import {AppContext} from '../context/AppContext'
import {toast} from 'react-toastify'
import {useContext} from 'react'  
import { useState } from 'react'
import axios from 'axios'


const ResetPassword = () => {
  const [email,setEmail] = useState("")
  const [newPassword,setNewPassword] = useState("")
  const [isEmailSent,setIsEmailSent] = useState("")  
  const [otp,setOtp] = useState("")
  const [isOtpSubmitted,setIsOtpSubmitted] = useState(false)

  const navigate = useNavigate()
  const inputRefs = React.useRef([])

  const {backendUrl,isLoggedIn,userData,getUserData} = useContext(AppContext)

  const SumbitEmail = async (e)=>{
    e.preventDefault()
    try {
      const {data} = await axios.post(`${backendUrl}/api/auth/send-reset-otp`,{email})
      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && setIsEmailSent(true)
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }


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
    values.forEach((value,index)=>{
      inputRefs.current[index].value = value
    })

    
  }
  const onSubmitOtp = async(e)=>{
    e.preventDefault()
   try {
    const otp = inputRefs.current.map(input => input.value).join("")
    setOtp(otp)
    setIsOtpSubmitted(true)
   }
    catch (error) {
      toast.error(error.response.data.message)
    }
  }
  
  const onSubmitNewPassword = async(e)=>{
    e.preventDefault()
    try {
      const {data} = await axios.post(`${backendUrl}/api/auth/reset-password`,{email,otp,newPassword})
      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && navigate("/login")
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    // Email verify form
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>
       <img onClick={() => navigate("/")} src={assets.logo} alt="" className='position absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>

       {!isEmailSent &&  
       <form onSubmit= {SumbitEmail} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 sm:w-96 text-indigo-300 text-sm">
       <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset Password</h1>
       <p className='text-center mb-6 text-indigo-300'>Enter your email id.</p>
       <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
         <img src={assets.mail_icon} alt="" className='w-3 h-3'/>
         <input type = "email" placeholder='Email id' className='bg-transparent outline-none text-white' required 
         value = {email}
         onChange = {(e) => setEmail(e.target.value)}
         />
         
       </div>
       <button className='cursor-pointer w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white mt-4 mb-5 font-medium'>Submit</button>


    </form>
       
       }
       

       
{/* Reset password form */}
{isEmailSent && !isOtpSubmitted && 
    <form  onSubmit={onSubmitOtp}  className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 sm:w-96 text-indigo-300 text-sm" type = 'submit'>
          <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset Password</h1>
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
          <button className = "cursor-pointer w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer">Verify OTP</button>
        </form>
}

{/* New password form */}
{isEmailSent && isOtpSubmitted && 

        <form onSubmit={onSubmitNewPassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 sm:w-96 text-indigo-300 text-sm">
        <h1 className="text-white text-2xl font-semibold text-center mb-4">New Password</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter the new password below</p>
        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
          <img src={assets.lock_icon} alt="" className='w-3 h-3'/>
          <input type = "password" placeholder='Password' className='bg-transparent outline-none text-white' required 
          value = {newPassword}
          onChange = {(e) => setNewPassword(e.target.value)}
          />
          
        </div>
        <button className='cursor-pointer w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white mt-4 mb-5 font-medium'>Submit</button>


     </form>

}
    </div>
  )
}

export default ResetPassword
