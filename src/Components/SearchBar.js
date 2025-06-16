import React, { useState } from 'react';

function SearchBar({ onSearch }){
    const [term, setTerm] = useState('');

    const handleSearch = () => {
        //API call goes here
        const fakeApiCall = [
            {id: 1, name: 'Firework', artist: "Katy Perry", Album: '???'}
        ];
        onSearch(fakeApiCall)
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