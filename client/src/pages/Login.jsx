import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios'
const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin ,getUserData } = useContext(AppContent);

  const [state, setState] = useState('Sign Up')
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const onsubmitHandler = async (e) => {
    try {
      e.preventDefault();
     
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // e.g. https://mern-autharp.vercel.app
  withCredentials: true, // ✅ send cookies
});

      if (state === 'Sign Up') {
        const { data } = await axiosInstance.post('/api/auth/register', { name, email, password })
        if (data.success) {
          setIsLoggedin(true)
          getUserData()
          navigate('/')
        }
        else {
          toast.error(data.message)
        }
      } else {

       const { data } = await axiosInstance.post('/api/auth/login', { email, password });
        if (data.success) {
          setIsLoggedin(true)
          getUserData()
          navigate('/')
        }
        else {
          toast.error(data.message)
        }

      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen sm:px-0 bg-gradient-to-b from-amber-100 to-purple-300'>
      <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-14 absolute top-[-20px]'>
        <img onClick={() => navigate('/')} src='/public/logo.png' alt='' className=" w-18 sm:w-25 cursor-pointer" />
      </div>
      <div className='text-white text-sm p-10 rounded-lg shadow-lg w-full sm:w-96  bg-slate-800'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'Sign Up' ? 'Create  Acount' : 'Login'}</h2>
        <p className='text-center text-sm mb-3 text-slate-400'>{state === 'Sign Up' ? 'Create Your Acount' : 'Login Your Account!'}</p>

        <form onSubmit={onsubmitHandler}>
          {state === 'Sign Up' && (<div className='mb-4 items-center mt-5 w-full px-5 py-2.5 rounded-full bg-gray-50 gap-4 flex'>
            <i class="text-slate-800 ri-user-line"></i>
            <input onChange={e => setName(e.target.value)} value={name} className=' bg-transparent text-slate-900 outline-none rounded-2xl px-3 ' type="text" placeholder='Full Name ' required />
          </div>)}

          <div className='mb-4 items-center mt-5 w-full px-5 py-2.5 rounded-full bg-gray-50 gap-4 flex'>
            <i class="text-slate-800 ri-mail-line"></i>
            <input onChange={e => setEmail(e.target.value)} value={email} className=' bg-transparent text-slate-900 outline-none rounded-2xl px-3 ' type="email" placeholder='Email id ' required />
          </div>
          <div className='mb-4 items-center mt-5 w-full px-5 py-2.5 rounded-full bg-gray-50 gap-4 flex'>
            <i class="text-slate-800  ri-git-repository-private-line"></i>
            <input onChange={e => setPassword(e.target.value)} value={password} className=' bg-transparent text-slate-900 outline-none rounded-2xl px-3 ' type="password" placeholder='Password ' required />
          </div>
          <p onClick={() => navigate('/reset-password')} className='mb-4 px-1 text-blue-400  cursor-pointer'>Forgot password ?</p>
          <button className='py-2.5 rounded-full w-full bg-gradient-to-b from-slate-500 border border-slate-500 to-slate-800 text-white font-medium cursor-pointer  '>{state}</button>
        </form>
        {state === 'Sign Up' ? (<p className=' text-center text-1xl text-slate-400 mt-4 mb-1'>Already Have An Account ?{' '}
          <span onClick={() => setState('Login')} className='text-blue-400 cursor-pointer underline'>Login Here</span>
        </p>) : (<p className='text-center text-1xl text-slate-400 mt-4 mb-1'>Don't Have An Account ?{' '}
          <span onClick={() => setState('Sign Up')} className='text-blue-400 cursor-pointer underline'>Sign Up</span>
        </p>)}


      </div>
    </div>
  )
}

export default Login
