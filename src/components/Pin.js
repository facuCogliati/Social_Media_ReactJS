import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete, AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
// import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { BsFillBookmarkFill, BsBookmark } from "react-icons/bs";


import { client, urlFor } from '../client';
import { fetchUser} from '../utils/fetchUser'

const Pin = ({'pin' : {image, postedBy, _id, destination, save, like}}) => {
  const user = fetchUser()  
  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const [likingPost, setLikingPost] = useState(false);

  // El filter de abajo devuelve True si el usuario los guardo o false si no 
  // let alreadySaved = !!(save?.filter((item) => item?.postedBy?._id === user?.sub))?.length;
  const [savedPost, setSavedPost] = useState(!!(save?.filter((item) => item?.postedBy?._id === user?.sub))?.length)
  const [likedPost, setLikedPost] = useState(!!(like?.filter((item) => item?.postedBy?._id === user?.sub))?.length)

  const [numberLikePost, setNumberlikePost] = useState(like?.length)


 

  const navigate = useNavigate()

  const savePin = (id) => {
    if (!savingPost) {
      setSavingPost(true)
      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert('after', 'save[-1]', [{
          _key: uuidv4(),
          userId: user?.sub,
          postedBy: {
            _type: 'postedBy',
            _ref: user?.sub,
          },
        }])
        .commit()
        .then(() => {
          // Cuestionable reload 
          setSavedPost(true)
          setSavingPost(false)
          // window.location.reload();
        });
    }
  };

const unSavePin = (id) => {
  const saveToRemove = ['save[0]', `save[userId == ${user?.sub}]`]
  client.patch(id).unset(saveToRemove).commit()
  .then(()=>{
    setSavedPost(false)
  })
}

const likePin = (id) => {
  if (!likingPost) {
    setLikingPost(true)
    client
      .patch(id)
      .setIfMissing({ like: [] })
      .insert('after', 'like[-1]', [{
        _key: uuidv4(),
        userId: user?.sub,
        postedBy: {
          _type: 'postedBy',
          _ref: user?.sub,
        },
      }])
      .commit()
      .then(() => {
        // Cuestionable reload 
        setLikedPost(true)
        setLikingPost(false)
        setNumberlikePost(numberLikePost + 1)
        // window.location.reload();
      });
  }
};

const unlikePin = (id) => {
  const likeToRemove = ['like[0]', `like[userId == ${user?.sub}]`]
  client.patch(id).unset(likeToRemove).commit()
  .then(()=>{
    setLikedPost(false)
    setNumberlikePost(numberLikePost - 1)
  })
}


  const deletePin = (id) =>{
    client
      .delete(id)
      .then(()=>{
        window.location.reload();
      })
  }


  return (
    <div className="m-2">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className=" relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
          {image && (
        <img className="rounded-lg w-full " src={(urlFor(image).width(250).url())} alt="user-post" /> )}
        {postHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
            style={{ height: '100%' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                ><MdDownloadForOffline />
                </a>
              </div>
              {savedPost ? (
                <button  
                  className="bg-cyan-800 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    unSavePin(_id);
                  }}
                  >
                
                <BsFillBookmarkFill/>
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                  type="button"
                  className="bg-cyan-800 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  
                  <BsBookmark/>
                </button>
              )}
            </div>
            <div className=" flex justify-between items-center gap-2 w-full">

              {/* Savar a la mierda */}
              {likedPost ? (
                <button 
                  type="button" 
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    unlikePin(_id);
                  }}
                  >
                
                  {/* {numberLikePost}   */}
                  <AiFillHeart/>
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    likePin(_id);
                  }}
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                    {/* {numberLikePost}  */}
                    <AiOutlineHeart/>
                </button>
              )}
              {/* Hasta Aca */}
              
              {
           postedBy?._id === user?.sub && (
           <button
             type="button"
             onClick={(e) => {
               e.stopPropagation();
               deletePin(_id);
             }}
             className="bg-white p-2 rounded-full w-8 h-8 flex items-center justify-center text-dark opacity-75 hover:opacity-100 outline-none"
           >
             <AiTwotoneDelete />
           </button>
           )
        }
            </div>
          </div>
        )}
      </div>
      <Link to={`/user-profile/${postedBy?._id}`} className="flex gap-2 mt-2 items-center">
        <img
          className="w-8 h-8 rounded-full object-cover"
          src={postedBy?.image}
          alt="user-profile"
        />
        <p className="font-semibold capitalize">{postedBy?.userName}</p>
      </Link>
    </div>
  )
}

export default Pin