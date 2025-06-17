import React from 'react';
import Tracklist from './Tracklist';

function SearchResults({ results, onAdd }){

    return(
        <div id='results'>
            <h1>Results:</h1>
            <Tracklist tracks={results} onAdd={onAdd} isRemoval={false}></Tracklist>
        </div>
    )
}

export default SearchResults;