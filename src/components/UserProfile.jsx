import React, { useEffect, useState } from 'react'
import { AiOutlineLogout } from "react-icons/ai";
import { useNavigate, useParams } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data';
import { client } from '../client';
import MasonmaryLayout from './MasonryLayout';
import Spinner from './Spinner';
const randomImage = 'https://random.imagecdn.app/1600/900';
const activeBtnStyle = "bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none";
const notActiveBtnStyle = "bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none";
const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState('Created');
  const [activeButton, setActiveButton] = useState('created')

  const navigate = useNavigate();
  const { userId } = useParams();
  const logout = () => {
    googleLogout();
    localStorage.clear();
    navigate('/login');
  }

  useEffect(() => {
    const query = userQuery(userId);
    client.fetch(query).then((data) => {
      setUser(data[0]);
    })
  }, [userId]);
  useEffect(() => {
    if (text === 'Created') {
      const query = userCreatedPinsQuery(userId);
      client.fetch(query).then((data) => {
        console.log(data);
        setPins(data);
      })
    } else {
      const query = userSavedPinsQuery(userId);
      client.fetch(query).then((data) => {
        setPins(data);
      })
    }
  }, [text, userId])


  if (!user) return <Spinner message={"Loading profile..."} />
  return (
    <div className='relative flex pb-2 justify-center items-center'>
      <div className='flex flex-col pb-5'>
        <div className='relative flex flex-col mb-7'>
          <div className='flex flex-col justify-center items-center'>
            <img
              src={randomImage}
              alt="banner-picture"
              className='w-full h-340 xl:h-96 shadow-lg object-cover'
            />
            <img
              src={user.image}
              alt="user-picture"
              className='rounded-full w-20 h-20 -mt-10 shadow-xl object-cover'
            />
            <h1 className='font-bold text-3xl text-center mt-3'>
              {user.userName}
            </h1>
            <div className='absolute top-0 z-10 right-0 p-2'>
              {userId === user._id && (
                <button
                  type='button'
                  className='bg-white p-2 rounded-full outline-none shadow-md'
                  onClick={logout}
                >
                  <AiOutlineLogout color='red' fontSize={21} />
                </button>
              )}
            </div>
          </div>
          <div className='text-center mb-7'>
            <button
              type='button'
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveButton('created')
              }}
              className={`${activeButton === 'created' ? activeBtnStyle : notActiveBtnStyle}`}
            >
              Created
            </button>
            <button
              type='button'
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveButton('saved')
              }}
              className={`${activeButton === 'saved' ? activeBtnStyle : notActiveBtnStyle}`}
            >
              Saved
            </button>
          </div>
          {
            pins?.length ? (
              <div className='px-2'>
                <MasonmaryLayout pins={pins} />
              </div>
            ) : (
              <div className='flex justify-center items-center font-bold w-full text-xl mt-2'>
                No pins founded
              </div>
            )
          }

        </div>
      </div>
    </div>
  )
}

export default UserProfile