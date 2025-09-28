import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function Navbar() {


  const navigate = useNavigate();
  const { userData, backendUrl, setUserData,setIsLoggedin } = useContext(AppContent);


  const sendVerificationOtp = async ()=>{
    try {
      
      axios.defaults.withCredentials = true;

      const {data} = await axios.post(backendUrl + '/api/auth/sent-verify-otp');
      
      if(data.success){
        navigate('/email-verify')
        toast.success("data.message")
      }else{
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  const logout = async ()=>{
    try {
      axios.defaults.withCredentials = true

      const {data}= await axios.post(backendUrl + '/api/auth/logout')

      data.success && setIsLoggedin(false)
      data.success && setUserData(false)
      navigate('/')
    } catch (error) {
      toast.error(error.message)
    }
  }
  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-14 absolute top-[-20px]'>
      <img src='/logo.png' alt='' className=" w-18 sm:w-25" />
      {userData ?
        <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group cursor-pointer'>
          {userData.name[0].toUpperCase()}
          <div className=' absolute hidden group-hover:block top-0 right-0 text-black z-10 rounded pt-10'>
            <ul className=' list-none m-0 p-2 bg-gray-100 text-sm'>
              {!userData.isAccountVerified && <li onClick={sendVerificationOtp}  className='py-1 rounded px-2 hover:bg-gray-200  cursor-pointer'>Verify Email</li>
              }
              <li onClick={logout} className='py-1 rounded px-2 hover:bg-gray-200 cursor-pointer pr-20'>Logout</li>
            </ul>
          </div>
        </div>
        : <button onClick={() => navigate('/login')} className='cursor-pointer  flex items-center gap-2 border border-amber-200 rounded-full px-6 py-2 hover:bg-amber-300 transition-all duration-500'>Login <i class="ri-arrow-right-line"></i></button>
      }
    </div>
  )
}

export default Navbar
