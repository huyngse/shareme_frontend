import React, { useEffect, useState } from 'react'
import MasonryLayout from './MasonryLayout';
import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';
import Spinner from './Spinner';
const Search = ({ searchTerm, setSearchTerm }) => {
  const [pins, setPins] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setLoading(true);
      if (searchTerm) {
        const query = searchQuery(searchTerm.toLowerCase());
        client.fetch(query).then((data) => {
          setPins(data);
          setLoading(false);
        })
      } else {
        client.fetch(feedQuery).then((data) => {
          setPins(data);
          setLoading(false);
        })
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm])

  return (
    <div>
      {loading && <Spinner message={"Searching for pins..."} />}
      {pins?.length > 0 && <MasonryLayout pins={pins} />}
      {pins?.length === 0 && searchTerm !== '' && !loading && (
        <div className='mt-10 text-center text-xl'>No Pins Found!</div>
      )}
    </div>
  )
}

export default Search