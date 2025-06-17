import React from 'react';
import './Track.css';

function Track({ track, onAdd, onRemove, isRemoval}){

    const handleClick = () => {
        isRemoval ? onRemove(track) : onAdd(track);
    };     

    return(
        <div id="trackFormat">
            <div>
                <div><strong>{track.name}</strong></div>
                <div><em>{track.artist} | {track.album}</em></div>
            </div>
            <button 
                onClick={handleClick} 
                className={isRemoval ? 'remove-button' : 'add-button'}
            >
                {isRemoval ? <div className='minus'/> : <div className='plus'>
                    <div className='vert'/><div className='hor'/>
                    </div>}
            </button>
        </div>
    )
}

export default Track;