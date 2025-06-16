import React from 'react';
import Tracklist from './Tracklist';

function Playlist({ name, tracks, onRemove, onNameChange}){

    return(
        <div>
            <input placeholder='Name playlist...' value={name} onChange={(e) => onNameChange(e.target.value)}></input>
            <Tracklist tracks={tracks} onRemove={onRemove} isRemoval={true}></Tracklist>
            <button>Save to Spotify</button>
        </div>
    )
}

export default Playlist;