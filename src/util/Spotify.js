const clientId = '61cb2bc0fcbc490aa321a3bc52818d34';
const redirectUri = 'http://localhost:3000';

let accessToken = '';

const Spotify = {
  getAccessTokenFromUrl() {
    const tokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (tokenMatch && expiresMatch) {
      accessToken = tokenMatch[1];
      const expiresIn = Number(expiresMatch[1]);
      window.setTimeout(() => (accessToken = ''), expiresIn * 1000);

      // Clean URL to remove token info from the address bar (important to avoid loop)
      window.history.replaceState({}, document.title, '/');

      return accessToken;
    }
    return null;
  },

  getAccessToken() {
    if (accessToken) return accessToken;
    return this.getAccessTokenFromUrl();
  },

  redirectToAuth() {
    const scopes = ['playlist-modify-public'];
    const authURL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=${scopes.join('%20')}&redirect_uri=${encodeURIComponent(redirectUri)}`;


    window.location = authURL;
  },

  async search(term) {
    const accessToken = this.getAccessToken();
    const endpoint = `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`;

    try {
      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error('Spotify search failed.');

      const jsonResponse = await response.json();
      return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri,
      }));
    } catch (error) {
      console.error("Spotify.search error:", error);
      throw error;
    }
  }
};

export default Spotify;
