import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AppRoutes, { getAppRoute } from '~/routing/AppRoutes';
import settings from '~/settings/settings';
import { getApiUrl } from '~/utilities/apiUtilities';
import { authGetJson } from '~/utilities/authFetches';

type User = {
  email: string;
  username: string;
  token: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setIsLoading] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    // On first app load, check if user data is stored in localStorage
    const storedToken = localStorage.getItem(settings.localStorageTokenName);

    if (!storedToken) {
      return;
    }

    setIsLoading(true);

    // If a token exists, ask the user for the user data.
    const fetchUserData = async () => {
      try {
        const response = await authGetJson({
          url: getApiUrl("/me"),
        });

        const json = await response.json();

        const loginResult = {
          email: json.email,
          token: json.token,
          username: json.username || "",
        };

        setUser({
          email: loginResult.email,
          username: json.username || "",
          token: json.token,
        });
      } catch (err) {
        // Redirect to login if the user data cannot be fetched.
        localStorage.removeItem(settings.localStorageTokenName);
        nav(getAppRoute(AppRoutes.Login));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);


  const onSetUser = useCallback((user: User | null) => {
    if (user?.token) {
      localStorage.setItem(settings.localStorageTokenName, user.token);
    } else {
      localStorage.removeItem(settings.localStorageTokenName);
    }

    setUser(user);
  }, [setUser]);

  return (
    <UserContext.Provider value={{ user, setUser: onSetUser }}>
      {loading ? (
        <div>Loading...</div>
      ) : children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};