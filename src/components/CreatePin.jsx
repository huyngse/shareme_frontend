import React, { useState } from 'react'
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { categories } from '../utils/data';
import Spinner from './Spinner';
import { client } from '../client';
const CreatePin = ({ user }) => {
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(null);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);
  const [savingPin, setSavingPin] = useState(false);
  const navigate = useNavigate();
  const uploadImage = (e) => {
    const { type, name } = e.target.files[0];
    if (type === "image/png"
      || type === "image/svg"
      || type === "image/gif"
      || type === "image/jpeg"
      || type === "image/tiff"
    ) {
      setWrongImageType(false);
      setLoading(true);
      client.assets.upload('image', e.target.files[0], { contentType: type, fileName: name })
        .then((document) => {
          setImageAsset(document);
          setLoading(false);
        }).catch((error) => {
          console.log("Image upload error ", error);
        });
    } else {
      setWrongImageType(true);
    }
  }
  const savePin = () => {
    if (title && about && destination && imageAsset?._id && category) {
      setSavingPin(true);
      const doc = {
        _type: 'pin',
        title,
        about,
        destination,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id
          }
        },
        userId: user._id,
        postedBy: {
          _type: 'postedBy',
          _ref: user._id
        },
        category,
      }
      client.create(doc).then(() => {
        navigate('/');
        setSavingPin(false);
      })
    } else {
      setFields(true);
      setTimeout(() => { setFields(false) }, 2000)
    }
  }
  return (
    <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
      {fields && (
        <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>
          Please fill in all the fields.
        </p>
      )}
      <div className='flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full'>
        <div className='bg-secondaryColor p-3 flex flex-0.7 w-full'>
          <div className='flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420'>
            {
              loading && <Spinner />
            }
            {
              wrongImageType && (
                <p>Wrong image type</p>
              )
            }
            {
              !imageAsset ? (
                <label className='cursor-pointer'>
                  <div className='flex-col-center'>
                    <div className='flex-col-center'>
                      <p className='font-bold text-2xl'>
                        <AiOutlineCloudUpload />
                      </p>
                      <p className='text-lg'>
                        Click to upload
                      </p>
                    </div>
                    <p className='mt-32 text-gray-400'>
                      Use high-quality jpg, svg, png or gif less than 20Mb
                    </p>
                  </div>
                  <input
                    type="file"
                    name='upload-image'
                    onChange={uploadImage}
                    className='w-0 h-0'
                  />
                </label>
              ) : (
                <p className='relative h-full'>
                  <img src={imageAsset?.url} alt="uploaded-picture" className='h-full w-full object-cover' />
                  <button
                    type='button'
                    className='absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl outline-none hover:shadow-md transition-all duration-500 ease-in-out'
                    onClick={() => setImageAsset(null)}
                  >
                    <MdDelete />
                  </button>
                </p>
              )
            }
          </div>
        </div>

        <div className='flex flex-1 gap-6 flex-col lg:pl-5 mt-5 w-full'>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Add your title here'
            className='outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2'
          />
          {
            user && (
              <div className='flex gap-2 my-2 items-center bg-white rounded-lg'>
                <img
                  src={user.image}
                  alt="user-image"
                  className='w-10 h-10 rounded-full'
                />
                <p className='font-bold'>
                  {user.userName}
                </p>
              </div>
            )
          }
          <input
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder='What is your pin about'
            className='outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2'
          />
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder='Add a destination link'
            className='outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2'
          />
          <div className='flex flex-col'>
            <div>
              <p className='mb-2 font-semibold text-lg sm:text:xl'>Choose Pin category</p>
              <select
                onChange={(e) => setCategory(e.target.value)}
                className='outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer'
              >
                <option value="other" className='bg-white'>Select Category</option>
                {
                  categories.map((category) => (
                    <option
                      value={category.name}
                      className='text-base border-0 outline-none capitalize bg-white text-black'
                    >
                      {category.name}
                    </option>
                  ))
                }
              </select>
            </div>
            <div className='flex justify-end items-end mt-5'>
              <button
                type='button'
                onClick={savePin}
                className='bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none'
              >
                {savingPin ? "Saving" : "Save Pin"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePin