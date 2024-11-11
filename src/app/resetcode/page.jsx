"use client";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { authProvider } from "@/context/AuthContext";

function Page() {
  const router = useRouter();
  const [otpCode, setOtpCode] = useState(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
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

  const handleChange = (e, index) => {
    const value = e.target.value.slice(0, 1); 
    const newOtpCode = [...otpCode];
    newOtpCode[index] = value;
    setOtpCode(newOtpCode);

    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);

    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (isMounted && token) {
      router.push("/admin");
    }
  }, [isMounted, token, router]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const otp = otpCode.join("");
      const res = await fetch(`http://localhost:3010/reset-password/otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: otp,
        },
        body: JSON.stringify({ otpCode: otp }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsLoading(false);
        toast.success("OTP confirmed");
        router.push(data.link);
      } else {
        toast.error("Invalid code");
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast.error("Invalid code");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fefbfb] relative">
      {/* Background shapes */}
      <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-[430px] h-[220px]">
        <div className="absolute w-[200px] h-[200px] bg-gradient-to-br from-[#1845ad] to-[#23a2f6] rounded-full -left-20 -top-20"></div>
        <div className="absolute w-[200px] h-[200px] bg-gradient-to-r from-[#ff512f] to-[#f09819] rounded-full -right-10 -bottom-20"></div>
      </div>

      {/* OTP Code Form */}
      <div className="relative w-[400px] h-[220px] bg-white/10 rounded-lg backdrop-blur-lg p-8 shadow-lg border border-white/20 flex flex-col items-center">
        <h3 className="text-center text-2xl font-medium text-black mb-8">
          Enter OTP Code
        </h3>

        <div className="flex space-x-2 mb-8">
          {otpCode.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              className="w-12 h-12 text-center bg-white/10 border border-bla text-black text-lg rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-800"
              placeholder="0"
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full h-12 bg-blue-500 text-[#fff] font-semibold rounded flex justify-center items-center transition duration-300"
        >
          {isLoading ? (
            <div className="flex gap-4 items-center">
              <p>Verifying...</p>
              <div className="loader w-8 h-8 border-4 border-[#eee]  rounded-full"></div>
            </div>
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </div>
  );
}

export default Page;
