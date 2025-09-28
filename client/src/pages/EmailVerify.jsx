import axios from 'axios';
import React, { useContext } from 'react'
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';


const EmailVerify = () => {

  const navigate = useNavigate();
  axios.defaults.withCredentials= true ;
  const {backendUrl, isLoggedin, userData, getUserData} = useContext(AppContent)
  const inputRefs = React.useRef([]);
  const handleInput = (e, index)=>{
    if(e.target.value.length > 0 && index < inputRefs.current.length - 1){
      inputRefs.current[index+1].focus();

    }
  }

  const handleKeyDown = (e, index)=>{
    if(e.key ==='Backspace' && e.target.value ===''&&index>0){
      inputRefs.current[index -1 ].focus();
    }
  }

  const handlePaste = (e)=>{
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index)=>{
    if(inputRefs.current[index]){
      inputRefs.current[index].value = char
    }
    })
  }

  const onsubmitHandle = async (e) => {
    try {
      e.preventDefault()
      const otpArray = inputRefs.current.map(e => e.value)
      const otp = otpArray.join('')

      const {data} = await axios.post(backendUrl + '/api/auth/verify-account',{otp})

      if(data.success){
        toast.success(data.message);
        getUserData()
        navigate('/');
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    isLoggedin && userData &&userData.isAccountVerified && navigate('/')
  },[isLoggedin,userData])

  return (
    <div className='flex items-center justify-center min-h-screen sm:px-0 bg-gradient-to-b from-amber-100 to-purple-300'>
      <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-14 absolute top-[-20px]'>
        <img onClick={() => navigate('/')} src='/public/logo.png' alt='' className=" w-18 sm:w-25 cursor-pointer" />
      </div>
      <form onSubmit={onsubmitHandle} className='bg-slate-900 rounded-lg shadow-lg w-96 p-5 text-sm'>
        <h1 className='text-white mt-5 text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
        <p className='text-center mb-6 text-slate-400'>Enter the 6-digit code sent to your email id</p>

        <div className='flex justify-between  'onPaste={handlePaste}>
          {Array(6).fill(0).map((_, index)=>(
              <input type="text" maxLength='1' key={index} required  className='w-12 h-12 bg-[#333A5C] text-xl text-center rounded-md text-white' ref={e=> inputRefs.current[index]= e} onKeyDown={(e)=>handleKeyDown(e,index)} onInput={(e)=>handleInput(e, index)}/>
          ))}
        </div>
        <button className=' py-3 w-full mt-10 bg-gradient-to-t border cursor-pointer border-slate-500 rounded-full from-slate-600 text-white to-slate-900'>Verify email</button>
      </form>
    </div>
  )
}

export default EmailVerify
