import React, { useContext } from 'react'
import { AppContent } from '../context/AppContext'

const Header = () => {
    const {userData} = useContext(AppContent)
  return (
    <div className=' flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
        <img src="/public/robothy.png" className='w-55 h-56 rounded-full mb-6' alt="" />
         <h1 className='gap-5 text-center text-xl sm-text-3xl  items-center '>Hey {" "}{userData ? userData.name : 'User'}! 🖐</h1>
         <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcom to our app</h2>
         <p className='mb-8 max-w-md'> let's start with a quick product tour and we will have you up and running in no time!</p>
         <button className='border border-amber-200 rounded-full px-8 py-2.5 hover:bg-amber-200 transition-all duration-700'>Get Started</button>
    </div>
  )
}

export default Header
