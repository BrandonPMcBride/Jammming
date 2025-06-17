import React from 'react';
import Track from './Track';

function Tracklist({ tracks = [], onAdd, onRemove, isRemoval }) {
  // Ensure tracks is always an array
  if (!Array.isArray(tracks)) {
    console.error('Tracklist expected an array but received:', tracks);
    return <div>Error loading tracks.</div>;
  }

  return (
    <div>
      {tracks.map(track => (
        <Track
          key={track.id}
          track={track}
          onAdd={onAdd}
          onRemove={onRemove}
          isRemoval={isRemoval}
        />
      ))}
    </div>
  );
}

export default Tracklist;
