import React from 'react'
import {assets} from '../assets/assets'
import {useNavigate} from 'react-router-dom'
import {useContext} from 'react'
import {AppContext} from '../context/AppContext'
import axios from 'axios'
import {toast} from 'react-toastify'



const Navbar = () => {
  const navigate = useNavigate()
  const {userData, setIsLoggedIn,setUserData,backendUrl} = useContext(AppContext)

const logout= async ()=>{
  try {
    axios.defaults.withCredentials = true
    const {data} = await axios.post(`${backendUrl}/api/auth/logout`)
    data.success && setIsLoggedIn(false)
    data.success && setUserData(false)
    navigate('/')

  } catch (error) {
    toast.error(error.message)
  }
}
const SendVerificationOtp = async()=>{
  try {
    axios.defaults.withCredentials = true
    const {data} = await axios.post(`${backendUrl}/api/auth/send-verify-otp`)
    if (data.success){
      toast.success(data.message)
      navigate('/email-verify')
    }
  } catch (error) {
    toast.error(error.message)
  }
}

  return (
    <div className = "w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={assets.logo} alt="logo" className='w-28 sm:w-32'/>
      {userData ? (
        <div className="relative group"> 
          <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white cursor-pointer"> 
            {userData.name[0].toUpperCase()}
          </div>
          <div className="absolute right-0 mt-2 hidden group-hover:block bg-white text-black shadow-md rounded p-2 z-10"> 
            <ul className="list-none m-0 p-2 bg-gray-100 text:sm">
              {!userData.isVerified && <li onClick={SendVerificationOtp} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">Verify Email</li> }
              <li onClick = {logout} className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-15">Logout</li>       
            </ul>
          </div>
        </div>
      )
      :
      <button className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all sm:text-lg cursor-pointer' onClick={() => navigate('/login')} >Login <img src={assets.arrow_icon} alt=""/></button>
      
      

      }
      
    </div>
  ) 
}

export default Navbar
