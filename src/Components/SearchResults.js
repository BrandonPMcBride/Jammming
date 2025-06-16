import React from 'react';
import Tracklist from './Tracklist';
import './SearchResults.css';

function SearchResults({ results, onAdd }){

    return(
        <div id='results'>
            <div>Results</div>
            <Tracklist tracks={results} onAdd={onAdd} isRemoval={false}></Tracklist>
        </div>
    )
}

export default SearchResults;