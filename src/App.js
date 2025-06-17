import React, { useState, useEffect } from 'react';
import SearchBar from './Components/SearchBar';
import SearchResults from './Components/SearchResults';
import Playlist from './Components/Playlist';
import './App.css';
import Spotify from './util/Spotify';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState('New Playlist');

  const addTrack = (track) => {
    if (playlistTracks.find(savedTrack => savedTrack.id === track.id)) return;
    setPlaylistTracks(prev => [...prev, track]);
  };

  const removeTrack = (track) => {
    setPlaylistTracks(prev => prev.filter(t => t.id !== track.id));
  };

  const updatePlaylistName = (name) => {
    setPlaylistName(name);
  };

  const savePlaylist = () => {
    const trackURIs = playlistTracks.map(track => track.uri);
    console.log('Saving playlist...');
    console.log('Name:', playlistName);
    console.log('Track URIs:', trackURIs);

    // Call Spotify.savePlaylist here if you implement it
    setPlaylistName('New Playlist');
    setPlaylistTracks([]);
  };

  const handleSearch = async (term) => {
    try {
      const results = await Spotify.search(term);
      setSearchResults(results);
    } catch (error) {
      console.error('Error loading tracks:', error);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const token = Spotify.getAccessToken();
    if (!token) {
      Spotify.redirectToAuth(); // Automatically redirect if token is missing
    }
  }, []);

  return (
    <div id="parentDiv">
      <div>
        <SearchBar onSearch={handleSearch} />
        <SearchResults results={searchResults} onAdd={addTrack} />
      </div>
      <div>
        <Playlist
          name={playlistName}
          tracks={playlistTracks}
          onRemove={removeTrack}
          onNameChange={updatePlaylistName}
          onSave={savePlaylist}
        />
      </div>
    </div>
  );
}

export default App;
