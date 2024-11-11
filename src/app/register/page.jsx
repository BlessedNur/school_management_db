"use client";
import { authProvider } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const {
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
  } = useContext(authProvider);
  const path = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      first_name: firstName,
      last_name: lastName,
      username: username,
      email: email,
      password: password,
      password_confirm: confirmPassword,
    };
    console.log(userData);
    try {
      const response = await fetch("http://localhost:3010/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        path.push("/login");
        alert("user registered succesfully");
      }
      response.statusCode = 200;
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (token) {
      path.push("/dashboard");
    }
  }, [token]);

  return (
    <div className=" w-[100vw] grid place-content-center h-[100vh]">
      <form
        action=""
        onSubmit={handleSubmit}
        className="  m-4 scale-90 capitalize shadow-xl p-3 flex flex-col gap-3"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="">First Name</label>
          <input
            className="p-3 outline-none bg-slate-100 rounded-md"
            type="text"
            placeholder=""
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="">Last Name</label>
          <input
            className="p-3 outline-none bg-slate-100 rounded-md"
            type="text"
            placeholder=""
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="">Username</label>
          <input
            className="p-3 outline-none bg-slate-100 rounded-md"
            type="text"
            placeholder=""
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="">email</label>
          <input
            className="p-3 outline-none bg-slate-100 rounded-md"
            type="email"
            placeholder=""
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="">password</label>
          <input
            className="p-3 outline-none bg-slate-100 rounded-md"
            type="password"
            placeholder=""
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="">confirm password</label>
          <input
            className="p-3 outline-none bg-slate-100 rounded-md"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            id=""
          />
        </div>
        <button type="submit" className="py-2 px-4 bg-blue-500 text-white">
          Register
        </button>
      </form>
    </div>
  );
}

export default Page;
