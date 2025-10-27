import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const AuthContext = createContext();
const API = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [redirectPath, setRedirectPath] = useState(null);

  const isAuthenticated = !!user?.id && !!token;
  const isAdmin = user?.isAdmin === true;

  // ✅ Load from localStorage on first mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("authUser");
      const storedToken = localStorage.getItem("authToken");
      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.id) {
          setUser(parsedUser);
          setToken(storedToken);
          console.log("🔁 Restored token from localStorage:", storedToken);
        }
      }
    } catch {
      localStorage.removeItem("authUser");
      localStorage.removeItem("authToken");
    }
  }, []);

  // ✅ Persist to localStorage on change
  useEffect(() => {
    try {
      if (user && token) {
        localStorage.setItem("authUser", JSON.stringify(user));
        localStorage.setItem("authToken", token);
        console.log("✅ Stored token to localStorage:", token);
      } else {
        localStorage.removeItem("authUser");
        localStorage.removeItem("authToken");
        console.log("🧹 Cleared token from localStorage");
      }
    } catch {}
  }, [user, token]);

  // ✅ Login with token + user
  const login = ({ token, user }, onLoginSuccess) => {
    console.log("🔐 Logging in with token:", token);
    setUser(user);
    setToken(token);
    setRedirectPath(null);
    if (typeof onLoginSuccess === "function") onLoginSuccess(user);
  };

  // ✅ Logout and clear everything
  const logout = (onLogout) => {
    console.log("🚪 Logging out");
    setUser(null);
    setToken(null);
    setRedirectPath(null);
    try {
      localStorage.removeItem("authUser");
      localStorage.removeItem("authToken");
      sessionStorage.clear();
    } catch {}
    if (typeof onLogout === "function") onLogout();
    window.location.replace("/login");
  };

  // ✅ Optional: login via username/password (if needed)
  const loginWithBackend = async (identifier, password) => {
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password })
      });

      if (!res.ok) {
        console.error("❌ Login failed: bad response");
        setUser(null);
        setToken(null);
        return;
      }

      const { token, user } = await res.json();
      if (token && user?.id) {
        login({ token, user });
      } else {
        console.error("❌ Login failed: missing token or user");
        setUser(null);
        setToken(null);
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setUser(null);
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        loginWithBackend,
        redirectPath,
        setRedirectPath
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
