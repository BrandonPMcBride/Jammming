const clientId = '61cb2bc0fcbc490aa321a3bc52818d34';
const redirectUri = 'http://127.0.0.1:3000';

const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const tokenEndpoint = "https://accounts.spotify.com/api/token";
const scope = 'user-read-private user-read-email playlist-read-private playlist-modify-private playlist-modify-public';

// Data structure that manages the current active token and userData, caching it in localStorage
export const currentToken = {
  get access_token() { return localStorage.getItem('access_token') || null; },
  get refresh_token() { return localStorage.getItem('refresh_token') || null; },
  get expires_in() { return localStorage.getItem('expires_in') || null; },
  get expires() { return localStorage.getItem('expires') || null; },

  save: function (response) {
    const { access_token, refresh_token, expires_in } = response;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('expires_in', expires_in);

    const now = new Date();
    const expiry = new Date(now.getTime() + (expires_in * 1000));
    localStorage.setItem('expires', expiry);
  }
};

export const userData = {
  get display_name() { return localStorage.getItem('display_name') || null;},
  get id() { return localStorage.getItem('id') || null;},

  save: function (response) {
    const {display_name, id} = response;
    localStorage.setItem('display_name', display_name);
    localStorage.setItem('id', id);
  }
};

// On page load, try to fetch auth code from current browser search URL
const args = new URLSearchParams(window.location.search);
const code = args.get('code');

// If we find a code, we're in a callback, do a token exchange
if (code) {
  try {
    const token = await getToken(code);
    currentToken.save(token);
    // Remove code from URL so we can refresh correctly.
    const url = new URL(window.location.href);
    url.searchParams.delete("code");
    const updatedUrl = url.search ? url.href : url.href.replace('?', '');
    window.history.replaceState({}, document.title, updatedUrl);
  } catch (error) {
    console.log(error);
  }
  // If we have a token, we're logged in, so fetch user data and save to localStorage
  if (currentToken.access_token !== null) {
    try {
      const fetchedUserData = await getUserData();
      userData.save(fetchedUserData);
    } catch (error) {
      console.log(error);
      window.location.href = redirectUri;
      localStorage.clear();
      alert('Sorry!\nYou are not listed by the developer to use this app.\nThe app uses the development mode and has not an OCTA-extension,\nwhich is required by Spotify to make the App fully public.');
    }
  }
}

// Otherwise we're not logged in, so render the login template
async function redirectToSpotifyAuthorize() {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomValues = crypto.getRandomValues(new Uint8Array(64));
  const randomString = randomValues.reduce((acc, x) => acc + possible[x % possible.length], "");

  const code_verifier = randomString;
  const data = new TextEncoder().encode(code_verifier);
  const hashed = await crypto.subtle.digest('SHA-256', data);

  const code_challenge_base64 = btoa(String.fromCharCode(...new Uint8Array(hashed)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  window.localStorage.setItem('code_verifier', code_verifier);

  const authUrl = new URL(authorizationEndpoint)
  const params = {
    response_type: 'code',
    client_id: clientId,
    scope: scope,
    code_challenge_method: 'S256',
    code_challenge: code_challenge_base64,
    redirect_uri: redirectUri,
  };

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString(); // Redirect the user to the authorization server for login
}

// Spotify API Calls
async function getToken(code) {
  const code_verifier = localStorage.getItem('code_verifier');

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      code_verifier: code_verifier,
    }),
  });
  return await response.json();
}

async function refreshToken() {
  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'refresh_token',
      refresh_token: currentToken.refresh_token
    }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    // If refresh token is invalid, clear all stored tokens and force re-auth
    if (data.error === 'invalid_grant' || data.error === 'invalid_token') {
      console.log('Refresh token is invalid, clearing stored tokens...');
      localStorage.clear();
      throw new Error('INVALID_REFRESH_TOKEN');
    }
    throw new Error(`Token refresh failed: ${data.error} - ${data.error_description}`);
  }
  
  return data;
}

async function getUserData() {
  const response = await fetch("https://api.spotify.com/v1/me", {
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + currentToken.access_token },
  });
  return await response.json();
}

// Click handlers
export async function loginWithSpotifyClick() {
  await redirectToSpotifyAuthorize();
}

export async function logoutClick() {
  localStorage.clear();
  window.location.href = redirectUri;
}

export async function refreshTokenClick() {
  const token = await refreshToken();
  currentToken.save(token);
}

// Spotify API methods for the app
const Spotify = {
  getAccessToken() {
    return currentToken.access_token;
  },

  // Check if token is expired and refresh if needed
  async ensureValidToken() {
    const expires = currentToken.expires;
    if (!expires) return;

    const expiryDate = new Date(expires);
    const now = new Date();
    
    // Refresh if token expires in the next 5 minutes
    if (expiryDate.getTime() - now.getTime() < 5 * 60 * 1000) {
      console.log('Token expiring soon, refreshing...');
      if (currentToken.refresh_token) {
        try {
          const newToken = await refreshToken();
          currentToken.save(newToken);
        } catch (error) {
          console.error('Failed to refresh token:', error);
          
          // If refresh token is invalid, force re-authentication
          if (error.message === 'INVALID_REFRESH_TOKEN') {
            window.location.reload(); // This will trigger the login flow
            return;
          }
          
          throw new Error('Authentication failed. Please log in again.');
        }
      }
    }
  },

  async redirectToAuth() {
    await redirectToSpotifyAuthorize();
  },

  async search(term) {
    // Proactively refresh token if needed
    await this.ensureValidToken();
    
    const accessToken = currentToken.access_token;
    if (!accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    // If we get a 401 (Unauthorized) or 403 (Forbidden), try to refresh the token
    if (response.status === 401 || response.status === 403) {
      console.log('Token expired or invalid, attempting to refresh...');
      
      if (currentToken.refresh_token) {
        try {
          const newToken = await refreshToken();
          currentToken.save(newToken);
          
          // Retry the search with the new token
          const retryResponse = await fetch(`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`, {
            headers: {
              Authorization: `Bearer ${currentToken.access_token}`
            }
          });
          
          if (!retryResponse.ok) {
            const errorText = await retryResponse.text();
            throw new Error(`Search failed after token refresh: ${retryResponse.status} ${errorText}`);
          }
          
          const retryJsonResponse = await retryResponse.json();
          if (!retryJsonResponse.tracks) {
            return [];
          }

          return retryJsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }));
          
        } catch (refreshError) {
          console.error('Failed to refresh token:', refreshError);
          
          // If refresh token is invalid, force re-authentication
          if (refreshError.message === 'INVALID_REFRESH_TOKEN') {
            window.location.reload(); // This will trigger the login flow
            return [];
          }
          
          throw new Error('Authentication failed. Please log in again.');
        }
      } else {
        throw new Error('Authentication failed. Please log in again.');
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Search failed: ${response.status} ${errorText}`);
    }

    const jsonResponse = await response.json();
    if (!jsonResponse.tracks) {
      return [];
    }

    return jsonResponse.tracks.items.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      uri: track.uri
    }));
  },

  async savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) {
      return;
    }

    // Proactively refresh token if needed
    await this.ensureValidToken();

    const accessToken = currentToken.access_token;
    const userId = userData.id;

    if (!accessToken || !userId) {
      throw new Error('No access token or user ID available');
    }

    // Helper function to make authenticated requests with token refresh
    const makeAuthenticatedRequest = async (url, options) => {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${currentToken.access_token}`
        }
      });

      if (response.status === 401 || response.status === 403) {
        console.log('Token expired or invalid, attempting to refresh...');
        
        if (currentToken.refresh_token) {
          try {
            const newToken = await refreshToken();
            currentToken.save(newToken);
            
            // Retry with new token
            return await fetch(url, {
              ...options,
              headers: {
                ...options.headers,
                Authorization: `Bearer ${currentToken.access_token}`
              }
            });
          } catch (refreshError) {
            console.error('Failed to refresh token:', refreshError);
            
            // If refresh token is invalid, force re-authentication
            if (refreshError.message === 'INVALID_REFRESH_TOKEN') {
              window.location.reload(); // This will trigger the login flow
              throw new Error('Re-authenticating...');
            }
            
            throw new Error('Authentication failed. Please log in again.');
          }
        } else {
          throw new Error('Authentication failed. Please log in again.');
        }
      }

      return response;
    };

    try {
      // Create playlist
      const createResponse = await makeAuthenticatedRequest(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          name: name,
          description: 'Created with Jammming',
          public: false
        })
      });

      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        throw new Error(`Failed to create playlist: ${createResponse.status} ${errorText}`);
      }

      const playlist = await createResponse.json();

      // Add tracks to playlist
      const addTracksResponse = await makeAuthenticatedRequest(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          uris: trackUris
        })
      });

      if (!addTracksResponse.ok) {
        const errorText = await addTracksResponse.text();
        throw new Error(`Failed to add tracks to playlist: ${addTracksResponse.status} ${errorText}`);
      }

      return playlist;
    } catch (error) {
      console.error('Error in savePlaylist:', error);
      throw error;
    }
  }
};

export default Spotify;


