import React, { useState } from 'react';
import SearchBar from './Components/SearchBar';
import SearchResults from './Components/SearchResults';
import Playlist from './Components/Playlist';
import './App.css'

function App() {

  const [searchResults, setSearchResults] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState('');

  const addTrack = (track) => {
    if (playlistTracks.find(savedTrack => savedTrack.id === track.id)) return;
    setPlaylistTracks([...playlistTracks, track]);
  };

  const removeTrack = (track) => {
    setPlaylistTracks(playlistTracks.filter(t => t.id !== track.id));
  };

  const updatePlaylistName = (name) => {
    setPlaylistName(name);
  }

  const savePlaylist = () => {
    const trackURIs = playlistTracks.map(track => track.url);
    console.log('Saving playlist...');
    console.log('Name:', playlistName);
    console.log('Track URIs:', trackURIs);

    setPlaylistName('');
    setPlaylistTracks([]);
  }

  return (
    <div id='parentDiv'>
      <div>
      <SearchBar onSearch={setSearchResults}></SearchBar>
      <SearchResults results={searchResults} onAdd={addTrack}></SearchResults>
      </div>
      <div>
        <Playlist
          name={playlistName}
          tracks={playlistTracks}
          onRemove={removeTrack}
          onNameChange={updatePlaylistName}
          onSave={savePlaylist}
        ></Playlist>
      </div>
    </div>
  );
}

export default App;