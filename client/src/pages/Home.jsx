import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'

const Home = () => {
  return (
    <div className='bg-amber-50 flex flex-col items-center justify-center h-screen'>
      <Navbar />
      <Header />
    </div>
  )
}

export default Home
