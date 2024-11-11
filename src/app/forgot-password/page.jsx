"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext ,useEffect, useState } from "react";
import { toast } from "sonner";
import { authProvider } from "@/context/AuthContext";

function Page() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const path = useRouter();
  const {
    token,
    setToken,
    currentUser,
    setCurrentUser,
    darkMode,
    setDarkMode,
    active,
    SetActive,
    setPopUp2,
    popUp_enroll_pop,
    popUp_course_pop,
    popUp_user_pop,
   } = useContext(authProvider);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);

    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (isMounted && token) {
      path.push("/admin");
    }
  }, [isMounted, token, path]);
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:3010/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.status === 404) {
        toast.error(data.message);
      }
      if (res.ok) {
        setIsLoading(false);

        toast.success("check you email");
        console.log({ message: data.message });
        path.push("/resetcode");
      } else {
        setIsLoading(false);
        toast.error("Failed to send reset link. Please try again.");
      }
    } catch (error) {
      setIsLoading(false);
      console.log("Error:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fefbfb] relative">
      {/* Background shapes */}
      <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-[430px] h-[220px]">
        <div className="absolute w-[200px] h-[200px] bg-gradient-to-br from-[#1845ad] to-[#23a2f6] rounded-full -left-20 -top-20"></div>
        <div className="absolute w-[200px] h-[200px] bg-gradient-to-r from-[#ff512f] to-[#f09819] rounded-full -right-10 -bottom-20"></div>
      </div>

      {/* Form */}
      <div className="relative w-[400px] h-[300px] bg-white/10 rounded-lg backdrop-blur-lg p-8 shadow-lg border border-white/20">
        <h3 className="text-center text-2xl font-medium text-black mb-8">
          Forgot your password?
        </h3>
        <h5 className="text-center pb-6">
          {" "}
          Enter the email associated with your account to recieve reset code
        </h5>
        <label
          htmlFor="username"
          className="block text-black text-lg font-medium mb-2"
        >
          Email Address
        </label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g example@example.com"
          id="username"
          className="w-full shadow-inner h-12 px-4 mb-6 rounded bg-white/10 text-black placeholder-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSubmit}
          className="w-full h-12 bg-blue-500 text-[#fff] font-semibold rounded flex justify-center items-center transition duration-300"
        >
          {isLoading ? (
            <div className="flex gap-4 items-center">
              <p>Sending code...</p>
              <div className="loader w-8 h-8 border-4 border-[#eee]  rounded-full"></div>
            </div>
          ) : (
            "Send reset code"
          )}
        </button>
      </div>
    </div>
  );
}

export default Page;
