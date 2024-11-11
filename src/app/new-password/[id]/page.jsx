"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

function Page({ params: paramsPromise }) {
  const path = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    async function unwrapParams() {
      const params = await paramsPromise;
      setToken(params.id);
    }
    unwrapParams();
  }, [paramsPromise]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`http://localhost:3010/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPassword,
          confirm_password: confirmPassword,
        }),
      });
      if (res.status === 400) {
        const data = await res.json();
        toast.info(data.message);
      }
      if (res.ok) {
        toast.success("Password reset successful");
        path.push("/");
      }
    } catch (error) {
      toast.error("An error occurred");
      console.log(error);
    } finally {
      setIsLoading(false);
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
      path.push("/admin");
    }
  }, [isMounted, token, path]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fefbfb] relative">
      {/* Background shapes */}
      <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-[430px] h-[220px]">
        <div className="absolute w-[200px] h-[200px] bg-gradient-to-br from-[#1845ad] to-[#23a2f6] rounded-full -left-20 -top-20"></div>
        <div className="absolute w-[200px] h-[200px] bg-gradient-to-r from-[#ff512f] to-[#f09819] rounded-full -right-10 -bottom-20"></div>
      </div>

      {/* Password reset form */}
      <div className="relative w-[400px] p-8 bg-white/10 rounded-lg backdrop-blur-lg shadow-lg border border-white/20">
        <h1 className="text-2xl font-semibold text-center text-black mb-6">
          Input New Password
        </h1>

        <div className="flex flex-col gap-4">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Input new password"
            className="w-full h-12 shadow-inner px-4 rounded bg-white/10 text-black placeholder-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            className="w-full h-12 shadow-inner px-4  rounded bg-white/10 text-black placeholder-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full h-12 my-6 bg-blue-500 text-white font-semibold rounded flex justify-center items-center transition duration-300"
        >
          {isLoading ? (
            <div className="flex gap-4 items-center">
              <p>Resetting password...</p>
              <div className="loader w-8 h-8 border-4 border-[#eee]  rounded-full"></div>
            </div>
          ) : (
            "Reset password"
          )}
        </button>
      </div>
    </div>
  );
}

export default Page;
