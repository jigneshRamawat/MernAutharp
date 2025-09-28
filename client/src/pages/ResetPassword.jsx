import React from 'react'
import { useContext } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const {backendUrl}= useContext(AppContent);

  axios.defaults.withCredentials = true;
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const [IsEmailSent, setIsEmialSent] = useState('')
  const [otp, setOtp] = useState(0)
  const [isOtpSubmited, setIsOtpSubmited] = useState(false)


  const inputRefs = React.useRef([]);


  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char
      }
    })
  }

const onSubmitEmail = async (e) =>{
  e.preventDefault();
  try {
    const {data}= await axios.post(backendUrl + '/api/auth/send-reset-otp',{email})

    data.success ? toast.success(data.message) : toast.error(data.error)
    data.success && setIsEmialSent(true)
  } catch (error) {
   toast.error(error.message) 
  }
}

const onSubmitOtp = async(e)=>{
  e.preventDefault();
  const otpArray = inputRefs.current.map(e => e.value)

  setOtp(otpArray.join(''))
  setIsOtpSubmited(true)
}

const onSubmitNewPassword = async(e)=>{
  e.preventDefault();
    try {
      
      const {data} = await axios.post(backendUrl + '/api/auth/reset-password',{email,otp, newPassword})
      data.success ? toast.success(data.message):toast.error(data.message)

      data.success && navigate('/login')
    } catch (error) {
      toast.error(error.message)
    }
}

  return (
    <div className='flex items-center justify-center min-h-screen sm:px-0 bg-gradient-to-b from-amber-100 to-purple-300'>
      <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-14 absolute top-[-20px]'>
        <img onClick={() => navigate('/')} src='/public/logo.png' alt='' className=" w-18 sm:w-25 cursor-pointer" />
      </div>
      {!IsEmailSent &&
        <form onSubmit={onSubmitEmail} className='bg-slate-900 rounded-lg shadow-lg w-96 p-5 text-sm'>
          <h1 className='text-white mt-5 text-2xl font-semibold text-center mb-4'>Reset password</h1>
          <p className='text-center mb-6 text-slate-400'>Enter your register email addresh</p>
          <div className='mb-4 items-center mt-5 w-full px-5 py-2.5 rounded-full bg-gray-50 gap-4 flex'>
            <i class="text-slate-800  ri-mail-line"></i>
            <input className='bg-transparent text-slate-900 outline-none rounded-2xl px-3' placeholder='Enter Email' value={email} type="email" onChange={e => setEmail(e.target.value)} required />
          </div>
          <button className='py-2.5 rounded-full w-full bg-gradient-to-b from-slate-500 border border-slate-500 to-slate-800 text-white font-medium cursor-pointer   '>Submit</button>
        </form>
        }

      {!isOtpSubmited && IsEmailSent &&
        <form onSubmit={onSubmitOtp} className='bg-slate-900 rounded-lg shadow-lg w-96 p-5 text-sm'>
          <h1 className='text-white mt-5 text-2xl font-semibold text-center mb-4'>Reset password OTP</h1>
          <p className='text-center mb-6 text-slate-400'>Enter the 6-digit code sent to your email id</p>

          <div className='flex justify-between  ' onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => (
              <input type="text" maxLength='1' key={index} required className='w-12 h-12 bg-[#333A5C] text-xl text-center rounded-md text-white' ref={e => inputRefs.current[index] = e} onKeyDown={(e) => handleKeyDown(e, index)} onInput={(e) => handleInput(e, index)} />
            ))}
          </div>
          <button className=' py-2.5 w-full mt-10 bg-gradient-to-t border cursor-pointer border-slate-500 rounded-full from-slate-600 text-white to-slate-900'>Submit</button>
        </form>
      }

{isOtpSubmited && IsEmailSent &&
      <form onSubmit={onSubmitNewPassword} className='bg-slate-900 rounded-lg shadow-lg w-96 p-5 text-sm'>
        <h1 className='text-white mt-5 text-2xl font-semibold text-center mb-4'>New password</h1>
        <p className='text-center mb-6 text-slate-400'>Enter Your New Password</p>
        <div className='mb-4 items-center mt-5 w-full px-5 py-2.5 rounded-full bg-gray-50 gap-4 flex'>
          <i class="text-slate-800 ri-git-repository-private-line"></i>
          <input className='bg-transparent text-slate-900 outline-none rounded-2xl px-3' placeholder='Enter password' value={newPassword} type="password" onChange={e => setNewPassword(e.target.value)} required />
        </div>
        <button className='py-2.5 rounded-full w-full bg-gradient-to-b from-slate-500 border border-slate-500 to-slate-800 text-white font-medium cursor-pointer   '>Submit</button>
      </form>
      }
    </div>
  )
}

export default ResetPassword
