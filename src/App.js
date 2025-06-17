import React, { useState, useEffect } from 'react';
import SearchBar from './Components/SearchBar';
import SearchResults from './Components/SearchResults';
import Playlist from './Components/Playlist';
import './App.css';
import Spotify from './util/Spotify';
import { currentToken, userData, logoutClick } from './util/Spotify';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState('New Playlist');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  const savePlaylist = async () => {
    const trackURIs = playlistTracks.map(track => track.uri);
    console.log('Saving playlist...');
    console.log('Name:', playlistName);
    console.log('Track URIs:', trackURIs);

    try {
      await Spotify.savePlaylist(playlistName, trackURIs);
      alert('Playlist saved successfully!');
      setPlaylistName('New Playlist');
      setPlaylistTracks([]);
    } catch (error) {
      console.error('Error saving playlist:', error);
      alert('Failed to save playlist. Please try again.');
    }
  };

  const handleSearch = async (term) => {
    try {
      const results = await Spotify.search(term);
      setSearchResults(results);
    } catch (error) {
      console.error('Error loading tracks:', error);
      setSearchResults([]);
      if (error.message.includes('No access token')) {
        setIsLoggedIn(false);
      }
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = Spotify.getAccessToken();
      const userId = userData.id;
      
      if (token && userId) {
        setIsLoggedIn(true);
      } else if (token && !userId) {
        // We have a token but no user data, might be mid-authentication
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
    
    // Check auth status periodically
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <h1>Welcome to Jammming</h1>
        <p>Please log in with Spotify to continue</p>
        <button onClick={() => Spotify.redirectToAuth()}>
          Log in with Spotify
        </button>
      </div>
    );
  }

  return (
    <div id="parentDiv">
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>Jammming</h1>
          <div>
            {userData.display_name && <span>Welcome, {userData.display_name}!</span>}
            <button onClick={logoutClick} style={{ marginLeft: '10px' }}>
              Logout
            </button>
          </div>
        </div>
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
