const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const authApiService = {
  // Login user to backend
  loginUser: async (firebaseToken) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firebaseToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Backend login failed');
    }

    return await response.json();
  },

  // Get current user from backend
  getCurrentUser: async (firebaseToken) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${firebaseToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get user data');
    }

    return await response.json();
  },

  // Logout from backend
  logoutUser: async (firebaseToken) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firebaseToken}`,
        'Content-Type': 'application/json'
      }
    });

    return response.ok;
  }
};