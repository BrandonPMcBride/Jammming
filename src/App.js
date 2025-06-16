import logo from './logo.svg';
import './App.css';
import SearchResults from './Components/SearchResults';
import Playlist from './Components/Playlist';

function App() {
  return (
    <div>
      <searchBar></searchBar>
      <div>
        <SearchResults></SearchResults>
        <Playlist></Playlist>
      </div>
    </div>
  );
}

export default App;
