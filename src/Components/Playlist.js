import React from 'react';
import Tracklist from './Tracklist';
import './Playlist.css'

function Playlist({ name, tracks, onRemove, onNameChange, onSave }){

    return(
        <div>
            <input type='text' placeholder='Name playlist...' value={name} onChange={(e) => onNameChange(e.target.value)}></input>
            <Tracklist tracks={tracks} onRemove={onRemove} isRemoval={true}></Tracklist>
            <button onClick={onSave}>Save to Spotify</button>
        </div>
    )
}

export default Playlist;