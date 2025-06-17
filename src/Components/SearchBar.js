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
              album: 'Harry’s House'
            },
            {
              id: 2,
              name: 'Anti-Hero',
              artist: 'Taylor Swift',
              album: 'Midnights'
            },
            {
              id: 3,
              name: 'First Class',
              artist: 'Jack Harlow',
              album: 'Come Home The Kids Miss You'
            },
            {
              id: 4,
              name: 'About Damn Time',
              artist: 'Lizzo',
              album: 'Special'
            },
            {
              id: 5,
              name: 'Industry Baby',
              artist: 'Lil Nas X & Jack Harlow',
              album: 'Montero'
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