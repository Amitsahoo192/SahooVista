import { createContext, useEffect, useState } from "react";

// 🔑 createContext → makes a "global box" to share data across components
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  // 🧠 useState → keeps track of the current logged-in user
  // It first tries to read "user" from localStorage (saved data in browser)
  // If nothing is found, it starts with null (no user)
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // ✍️ updateUser → changes the currentUser value
  // Example: when someone logs in or logs out, we call this function
  const updateUser = (data) => {     
    setCurrentUser(data);
  };

  // 📦 useEffect → runs automatically whenever currentUser changes
  // It saves the latest user info into localStorage
  // This way, even if you refresh the page, the user stays logged in
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  // 🌍 AuthContext.Provider → shares currentUser + updateUser
  // All child components inside can use this shared data
  return (
    <AuthContext.Provider value={{ currentUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
 