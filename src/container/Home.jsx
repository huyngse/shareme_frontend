import React, { useRef } from 'react'
import { HiMenu } from "react-icons/hi";
import { AiFillCloseCircle } from "react-icons/ai";
import { Sidebar, UserProfile } from '../components';
import { useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useEffect } from 'react';
import { userQuery } from '../utils/data';
import { client } from '../client';
import Pins from './Pins';
const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(true);
  const [user, setUser] = useState();
  const scrollRef = useRef(null);
  const userInfo = localStorage.getItem('user') !== undefined
    ? JSON.parse(localStorage.getItem('user'))
    : localStorage.clear();
  useEffect(() => {
    const query = userQuery(userInfo?.sub);
    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userInfo]);
  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  }, [])

  return (
    <div className='flex bg-gray-50 md:flex-row flex-col h-full transition-height duration-75 ease-in-out'>
      <div className='hidden md:flex h-screen flex-initial'>
        <Sidebar user={user && user} closeToggle={setToggleSidebar} />
      </div>
      <div className='flex md:hidden'>
        <div className='p-2 w-full flex justify-between items-center shadow-md'>
          <HiMenu className='text-[40px] cursor-pointer' onClick={() => setToggleSidebar(true)} />
          <Link to={'/'}>
            <img src={logo} alt="logo" className='w-28' />
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.image} alt="logo" className='w-28' />
          </Link>
        </div>
        {
          toggleSidebar && (
            <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>
              <div className='absolute w-full flex justify-end items-center p-2'>
                <AiFillCloseCircle
                  className='text-[30px] cursor-pointer'
                  onClick={() => { setToggleSidebar(false) }}
                />
              </div>
              <Sidebar user={user && user} closeToggle={setToggleSidebar} />
            </div>
          )
        }
      </div>

      <div className='pb-2 flex-1 h-screen  overflow-y-scroll' ref={scrollRef}>
        <Routes>
          <Route path='/user-profile/:userId' element={<UserProfile />} />
          <Route path='/*' element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  )
}

export default Home