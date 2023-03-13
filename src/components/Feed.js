import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const Feed = () => {
  const [loading, setLoading] = useState(false)
  const [pins, setPins] = useState(null)
  const categoryid = useParams()

  useEffect(() => {
    setLoading(true)
    if(categoryid['*'] !== ''){
      const query = searchQuery(categoryid['categoryId'])
      client.fetch(query)
        .then((data)=>{
          setPins(data)
          setLoading(false)
        })

    } else {
      client.fetch(feedQuery)
        .then((data) =>{
          setPins(data)
          setLoading(false)
        })

    }

  }, [categoryid])
  

  if (loading) return <Spinner message= 'Estamos cargando nuevos archivos '/>
  if (pins?.length < 1) return <h2>No hay imagenes disponibles en esta categoria</h2>
  return (
    <div>
      {pins && <MasonryLayout pins={pins} />}
    </div>
  )
}

export default Feed