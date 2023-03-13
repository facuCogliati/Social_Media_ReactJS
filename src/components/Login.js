import React  from 'react'
// import googlelogin from reactgoole
import {useNavigate} from 'react-router-dom';
import {GoogleLogin} from '@react-oauth/google';
import jwt_decode from 'jwt-decode'
import {client} from '../client'

import shareVideo from '../assets/share.mp4';
import logo from '../assets/logohome-removebg.png'

export const Login = () => {
  const navigation = useNavigate()

  const responseGoogle = (response) => {
    const decode = jwt_decode(response.credential)
    localStorage.setItem('user', JSON.stringify(decode))
    const {name, picture, sub} = decode

    const doc = {
      _id : sub,
      _type : 'user',
      userName : name,
      image : picture
    }

    client.createIfNotExists(doc)
      .then(()=>{
        navigation('/', {replace : true})

      })
  }


  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className=" relative w-full h-full">
        <video
          src= {shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />

        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo} width="110px" alt='logo' />
          </div>

          <div className="shadow-2xl">
            <GoogleLogin
              onSuccess={(response) => responseGoogle(response)}
              onError={()=>{
                console.log('algo salio mal')
              }}
            />
      
          </div>
        </div>
      </div>
    </div>
  )
}
