import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch("https://naimat-backend-f9drh3fcceewebcd.southeastasia-01.azurewebsites.net/user/profile", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else if (response.status === 401 || response.status === 403) {
        // Token expired or invalid - logout user
        console.log("Session expired, logging out...");
        logout();
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      // On network error, also logout to be safe
      logout();
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    setLoading(true);
    await fetchUserProfile();
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    // Redirect to home page
    window.location.href = '/';
  };

  // Helper function to check auth status on API calls
  const checkAuthError = (response) => {
    if (response.status === 401 || response.status === 403) {
      console.log("Authentication failed, logging out...");
      logout();
      return true;
    }
    return false;
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser, logout, checkAuthError }}>
      {children}
    </UserContext.Provider>
  );
};
