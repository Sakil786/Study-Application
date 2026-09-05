// Authentication functions for Study Log App
const AuthModule = (function() {
  
  // Authentication functions
  async function signup(username, email, password) {
    try {
      const data = await apiCall('/signup', {
        method: 'POST',
        body: JSON.stringify({ username, email, password })
      });
      
      localStorage.setItem('study_app_token', data.token);
      return data;
    } catch (error) {
      throw error;
    }
  }
  
  async function login(username, password) {
    try {
      const data = await apiCall('/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      
      localStorage.setItem('study_app_token', data.token);
      return data;
    } catch (error) {
      throw error;
    }
  }
  
  function logout() {
    localStorage.removeItem('study_app_token');
  }
  
  function getToken() {
    return localStorage.getItem('study_app_token');
  }
  
  return {
    signup,
    login,
    logout,
    getToken
  };
})();