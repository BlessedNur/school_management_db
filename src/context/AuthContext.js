"use client";

import React, { createContext, useState, useEffect } from "react";

export const authProvider = createContext();

function AuthContext({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [active, setActive] = useState("instructor");
  const [selectedCourse, setSelectedCourse] = useState({});
  const [selectedCourseName, setSelectedCourseName] = useState("");
  const [popUp, setPopUp] = useState({
    user_pop: false,
    course_pop: false,
    enroll_pop: false,
    delete_pop: false,
    update_course_pop: false,
    course_view_pop: false,
  });

  const [token, setToken] = useState("");
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
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
        selectedCourse,
        setSelectedCourse,
        selectedCourseName,
        setSelectedCourseName,
      }}
    >
      {children}
    </authProvider.Provider>
  );
}

export default AuthContext;
