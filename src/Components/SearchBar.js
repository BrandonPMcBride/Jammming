import React, { useState } from 'react';

function SearchBar({ onSearch }){
    const [term, setTerm] = useState('');

    const handleSearch = () => {
        //API call goes here
        const sampleTracks = [
            {
              id: 1,
              name: 'As It Was',
              artist: 'Harry Styles',
              album: 'Harry’s House',
              uri: 'spotify:track:3AsItWas123'
            },
            {
              id: 2,
              name: 'Anti-Hero',
              artist: 'Taylor Swift',
              album: 'Midnights',
              uri: 'spotify:track:3AntiHero456'
            },
            {
              id: 3,
              name: 'First Class',
              artist: 'Jack Harlow',
              album: 'Come Home The Kids Miss You',
              uri: 'spotify:track:3FirstClass789'
            },
            {
              id: 4,
              name: 'About Damn Time',
              artist: 'Lizzo',
              album: 'Special',
              uri: 'spotify:track:3AboutTime321'
            },
            {
              id: 5,
              name: 'Industry Baby',
              artist: 'Lil Nas X & Jack Harlow',
              album: 'Montero',
              uri: 'spotify:track:3Industry999'
            }
          ];
          
          
        onSearch(sampleTracks)
    };

    return(
        <div>
            <input
                type='text'
                placeHolder='Enter a song, album, or artist'
                value={term}
                onChange={(e) => setTerm(e.target.value)}
            />
            <button onClick={handleSearch}>SEARCH</button>
        </div>
    )
}

export default SearchBar;