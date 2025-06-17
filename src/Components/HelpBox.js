import React, { useState } from 'react';
import './HelpBox.css'; // optional, but cleaner

function HelpBox() {
  const [open, setOpen] = useState(false);

  return (
    <div className="help-container">
      <button className="help-button" onClick={() => setOpen(!open)}>
        ?
      </button>
      {open && (
        <div className="help-popup">
          <h4>How to Use Jammming</h4>
          <ul>
            <li>🔍 Search for songs, albums, or artists.</li>
            <li>➕ Click "+" to add songs to your playlist.</li>
            <li>✏️ Give your playlist a name.</li>
            <li>💾 Click "Save" to add it to your Spotify account!</li>
          </ul>
          <button className="close-help" onClick={() => setOpen(false)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default HelpBox;
