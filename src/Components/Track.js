import React from 'react';

function Track({ track, onAdd, onRemove, isRemoval}){

    const handleClick = () => {
        isRemoval ? onRemove(track) : onAdd(track);
    };

    return(
        <div>
            <div>
                <div>{track.name}</div>
                <div>{track.artist} | {track.album}</div>
            </div>
            <button onClick={handleClick}>{isRemoval ? '-' : '+'}</button>
        </div>
    )
}

export default Track;