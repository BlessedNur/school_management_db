"use client";
import { authProvider } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";

function page() {
  const path = useRouter();
  const [token, setToken, currentUser, setCurrentUser] =
    useContext(authProvider);
  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setCurrentUser(null);
    path.push("/login");
  };
  if (!token) {
    path.push("/login");
  }

  return (
    <div>
      <h1>Welcome {currentUser}</h1>
      <button onClick={() => logOut()}>Logout</button>
    </div>
  );
}

export default page;
