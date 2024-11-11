"use client"
import React, { createContext, useState, useEffect } from "react";

export const authProvider = createContext();

function AuthContext({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [active, SetActive] = useState("instructor");

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
      // const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      // if (storedToken) setToken(storedToken);
      if (storedUser) setCurrentUser(storedUser);
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
  }, []);

  return (
    <authProvider.Provider
      value={[
        token,
        setToken,
        currentUser,
        setCurrentUser,
        darkMode,
        setDarkMode,
        active,
        SetActive,
        setPopUp,
        popUp.enroll_pop,
        popUp.course_pop,
        popUp.user_pop,
      ]}
    >
      {children}
    </authProvider.Provider>
  );
}

export default AuthContext;
