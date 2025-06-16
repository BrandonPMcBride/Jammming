import React, { useState } from 'react';
import Tracklist from './Tracklist';

function Playlist(){



    return(
        <div>
            <input placeholder='Name playlist...'></input>
            <Tracklist></Tracklist>
            <button>Save to Spotify</button>
        </div>
    )
}

export default Playlist;