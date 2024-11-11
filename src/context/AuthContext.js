"use client";
import React, { createContext, useState, useEffect } from "react";

export const authProvider = createContext();

function AuthContext({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [active, setActive] = useState("instructor");

  const [popUp, setPopUp] = useState({
    user_pop: false,
    course_pop: false,
    enroll_pop: false,
    delete_pop: false,
  });

  const [token, setToken] = useState("");
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setCurrentUser(storedUser);
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
  }, []);

  return (
    <authProvider.Provider
      value={{
        token,
        setToken,
        currentUser,
        setCurrentUser,
        darkMode,
        setDarkMode,
        active,
        setActive,
        setPopUp,
        popUp,
      }}
    >
      {children}
    </authProvider.Provider>
  );
}

export default AuthContext;
