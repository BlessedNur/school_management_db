"use client";
import { authProvider } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

function Home() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
  console.log(token);
  console.log(currentUser);
  const path = useRouter();

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

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const userData = {
      name,
      email,
      role,
      password,
      confirm_password: confirmPassword,
    };

    try {
      const response = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsLoading(false);
        toast.success("Registered Successfully");
        path.push("/");
      } else {
        setIsLoading(false);
        toast.error(data.message);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("An error occurred");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1f0f0] relative">
      {/* Background shapes */}
      <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-[430px] h-[420px]">
        <div className="absolute w-[200px] h-[200px] bg-gradient-to-br from-[#1845ad] to-[#23a2f6] rounded-full -left-20 -top-20"></div>
        <div className="absolute w-[200px] h-[200px] bg-gradient-to-r from-[#ff512f] to-[#f09819] rounded-full -right-10 -bottom-20"></div>
      </div>

      {/* Form */}
      <div className="relative w-[400px] h-full bg-white/10 rounded-lg backdrop-blur-lg p-8 shadow-lg border border-white/20">
        <h3 className="text-center text-2xl font-medium text-black mb-8">
          Register Here
        </h3>

        <label
          htmlFor="username"
          className="block text-black text-lg font-medium mb-2"
        >
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          id="username"
          className="w-full shadow-inner h-12 px-4 mb-6 rounded bg-white/10 text-black placeholder-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label
          htmlFor="username"
          className="block text-black text-lg font-medium mb-2"
        >
          Email
        </label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          id="username"
          className="w-full shadow-inner h-12 px-4 mb-6 rounded bg-white/10 text-black placeholder-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label
          htmlFor="username"
          className="block text-black text-lg font-medium mb-2"
        >
          Role
        </label>
        <select
          name=""
          id=""
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full shadow-inner h-12 px-4 mb-6 rounded bg-white/10 text-black placeholder-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled defaultValue={""}>
            select role
          </option>
          <option value="student">student</option>
          <option value="instructor">instuctor</option>
        </select>

        <label
          htmlFor="password"
          className="block text-black text-lg font-medium mb-2"
        >
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          id="password"
          className="w-full h-12 shadow-inner px-4 mb-10 rounded bg-white/10 text-black placeholder-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label
          htmlFor="password"
          className="block text-black text-lg font-medium mb-2"
        >
          Confirm Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Password"
          id="password"
          className="w-full h-12 shadow-inner px-4 mb-10 rounded bg-white/10 text-black placeholder-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSubmit}
          className="w-full h-12 bg-blue-500 text-[#fff] font-semibold rounded flex justify-center items-center transition duration-300"
        >
          {isLoading ? (
            <div className="flex gap-4 items-center">
              <p>Registerring...</p>
              <div className="loader w-8 h-8 border-4 border-[#eee] rounded-full"></div>
            </div>
          ) : (
            "Register"
          )}
        </button>

        <div className="flex justify-center">
          <Link href={"/"} className="text-blue-500 cursor-pointer pt-4">
            Already have an account?
          </Link>
        </div>
        <div className="flex justify-center mt-8 gap-6">
          <div className="flex items-center justify-center w-[150px] h-12 rounded bg-white/30 text-gray-800 hover:bg-white/50 transition duration-300 cursor-pointer">
            <i className="fab fa-google mr-2"></i> Google
          </div>
          <div className="flex items-center justify-center w-[150px] h-12 rounded bg-white/30 text-gray-800 hover:bg-white/50 transition duration-300 cursor-pointer">
            <i className="fab fa-facebook mr-2"></i> Facebook
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

// "use client";
// import { authProvider } from "@/context/AuthContext";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import React, { useContext, useEffect, useState } from "react";
// import { toast } from "sonner";

// function Home() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const {
//     currentUser,
//     setCurrentUser,
//     darkMode,
//     setDarkMode,
//     active,
//     setActive,
//     setPopUp,
//     popUp,
//   } = useContext(authProvider);

//   const path = useRouter();

//   const handleSubmit = async (e) => {
//     setIsLoading(true);
//     e.preventDefault();
//     const userData = {
//       email,
//       password,
//     };

//     try {
//       const response = await fetch(
//         "http://localhost:4000/api/auth/login",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(userData),
//           credentials: "include", // Ensure cookies are included in the request
//         }
//       );

//       const data = await response.json();

//       if (response.ok) {
//         setIsLoading(false);
//         toast.success("Login Successfully");

//         // Fetch user data or set current user context as needed
//         setCurrentUser("admin");
//         path.push("/admin");
//       } else {
//         setIsLoading(false);
//         toast.error(data.message);
//       }
//     } catch (error) {
//       setIsLoading(false);
//       toast.error("An error occurred");
//       console.error(error);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#fefbfb] relative">
//       {/* Background shapes */}
//       <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-[430px] h-[420px]">
//         <div className="absolute w-[200px] h-[200px] bg-gradient-to-br from-[#1845ad] to-[#23a2f6] rounded-full -left-20 -top-20"></div>
//         <div className="absolute w-[200px] h-[200px] bg-gradient-to-r from-[#ff512f] to-[#f09819] rounded-full -right-10 -bottom-20"></div>
//       </div>

//       {/* Form */}
//       <div className="relative w-[400px] h-[420px] bg-white/10 rounded-lg backdrop-blur-lg p-8 shadow-lg border border-white/20">
//         <h3 className="text-center text-2xl font-medium text-black mb-8">
//           Login Here
//         </h3>

//         <label
//           htmlFor="username"
//           className="block text-black text-lg font-medium mb-2"
//         >
//           Email
//         </label>
//         <input
//           type="text"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Email"
//           id="username"
//           className="w-full shadow-inner h-12 px-4 mb-6 rounded bg-white/10 text-black placeholder-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
//         />

//         <label
//           htmlFor="password"
//           className="block text-black text-lg font-medium mb-2"
//         >
//           Password
//         </label>
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//           id="password"
//           className="w-full h-12 shadow-inner px-4 mb-10 rounded bg-white/10 text-black placeholder-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
//         />

//         <button
//           onClick={handleSubmit}
//           className="w-full h-12 bg-blue-500 text-[#fff] font-semibold rounded flex justify-center items-center transition duration-300"
//         >
//           {isLoading ? (
//             <div className="flex gap-4 items-center">
//               <p>Logging in...</p>
//               <div className="loader w-8 h-8 border-4 border-[#eee] rounded-full"></div>
//             </div>
//           ) : (
//             "Log In"
//           )}
//         </button>

//         <div className="flex justify-center">
//           <Link
//             href={"/forgot-password"}
//             className="text-blue-500 cursor-pointer pt-4"
//           >
//             Forgot Password?
//           </Link>
//         </div>
//         <div className="flex justify-center mt-8 gap-6">
//           <div className="flex items-center justify-center w-[150px] h-12 rounded bg-white/30 text-gray-800 hover:bg-white/50 transition duration-300 cursor-pointer">
//             <i className="fab fa-google mr-2"></i> Google
//           </div>
//           <div className="flex items-center justify-center w-[150px] h-12 rounded bg-white/30 text-gray-800 hover:bg-white/50 transition duration-300 cursor-pointer">
//             <i className="fab fa-facebook mr-2"></i> Facebook
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Home;
