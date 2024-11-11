"use client";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authProvider } from "@/context/AuthContext";
import Instructors from "@/components/Instructors/Instructors";
import Students from "@/components/Students/Students";
import Courses from "@/components/Courses/Courses";
import Enrollments from "@/components/Enrollments/Enrollments";
import { toast } from "sonner";

function Page() {
  const [dateNow, setDateNow] = useState(new Date().toDateString());
  const navigate = useRouter();
  const [isLoading, setIsLoading] = useState("");
  const [products, setProducts] = useState([]);
  const path = useRouter();

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
    selectedCourse,
    setSelectedCourse,
    selectedCourseName,
    setSelectedCourseName,
  } = useContext(authProvider);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [role, setRole] = useState("");
  const [alreadyEnrolled, setAlreadyEnrolled] = useState([]);
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedInstructors, setSelectedInstructors] = useState([]);

  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/courses/get_course",
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching Courses:", error);
      }
    };
    getCourses();
  }, [popUp.enroll_pop]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "http://localhost:3001/api/users/get_users",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setStudents(data.students);
          setInstructors(data.instructors);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [popUp.enroll_pop]);

  const toggleSelection = (id, list, setList) => {
    setList(
      list.includes(id) ? list.filter((item) => item !== id) : [...list, id]
    );
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/courses/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: selectedCourse,
          studentIds: selectedStudents,
          instructorIds: selectedInstructors,
        }),
      });

      const data = await response.json();

      if (response.status === 400) {
        const {
          alreadyEnrolledStudents = [],
          alreadyEnrolledInstructors = [],
        } = data.error;

        const enrolledStudentDetails = students.filter((student) =>
          alreadyEnrolledStudents.includes(student._id)
        );
        const enrolledInstructorDetails = instructors.filter((instructor) =>
          alreadyEnrolledInstructors.includes(instructor._id)
        );

        setAlreadyEnrolled({
          students: enrolledStudentDetails,
          instructors: enrolledInstructorDetails,
        });

        toast.error(`Some users are already enrolled || 
      
        Students: ${enrolledStudentDetails
          .map((student) => student.name)
          .join(", ")} \n
        Instructors: ${enrolledInstructorDetails
          .map((instructor) => instructor.name)
          .join(", ")}
        `);

        return;
      }

      if (response.ok) {
        toast.success("Enrollment successful");
        setSelectedStudents([]);
        setPopUp((prev) => ({ ...prev, enroll_pop: false }));
        setSelectedInstructors([]);
      } else {
        toast.error("Enrollment failed. Please try again.");
      }
    } catch (error) {
      console.error("Error enrolling:", error);
      toast.error("Error enrolling users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const addUser = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    console.log({
      name: name,
      email: email,
      role: role,
      enrollmentDate: dateNow,
    });
    try {
      const response = await fetch("http://localhost:3001/api/users/add_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          role: role,
          enrollmentDate: dateNow,
        }),
      });
      if (response.ok) {
        setName("");
        setEmail("");
        setRole("");
        setIsLoading(false);
        toast.success(role + " created succesfully");

        setPopUp((prev) => ({ ...prev, user_pop: false }));
        setActive(role);
      }
      if (response.status === 400) {
        toast.error("wrong credentials");
      }
    } catch (error) {
      console.log(error);
      toast.error("error occured");
    }
  };
  const addCourse = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:3001/api/courses/add_course",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category: category,
            duration: duration,
          }),
        }
      );
      if (response.ok) {
        setIsLoading(false);
        toast.success("Course created succesfully");

        setPopUp((prev) => ({ ...prev, course_pop: false }));
      }
      if (response.status === 400) {
        toast.error("wrong information");
      }
    } catch (error) {
      console.log(error);
      toast.error("error occured");
    }
  };

  const logOut = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setToken(null);
      setCurrentUser(null);

      path.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  console.log(token);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);

    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (isMounted && !token) {
      path.push("/");
    }
  }, [isMounted, token, path]);

  return (
    <div
      className={`flex h-screen w-screen transition duration-100 ${
        darkMode ? "bg-black text-gray-200" : "bg-[#f7f8fa]"
      }`}
    >
      <div
        className={`flex flex-col gap-4 h-full w-1/5 p-4 ${
          darkMode ? "bg-gray-800" : "bg-white"
        } justify-between`}
      >
        <div>
          <div className="flex gap-2 items-end  mb-8">
            <div className="w-10 h-10 rounded-full bg-gray-400 overflow-hidden">
              <img
                src={
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
              />
            </div>{" "}
            <h1 className="font-bold text-lg">Welcome, {currentUser}</h1>
          </div>
          <h1 className="text-lg font-semibold">Menu</h1>
          <ul className="flex flex-col gap-2">
            <li
              className={`flex gap-2 items-center p-4 rounded-md cursor-pointer transition ${
                active === "instructor"
                  ? "bg-[#f7f8fa] text-black"
                  : "text-gray-600"
              } `}
              onClick={() => setActive("instructor")}
            >
              <i className="fa fa-graduation-cap" aria-hidden="true"></i>
              <p>Instructors</p>
            </li>
            <li
              className={`flex gap-2 items-center p-4 rounded-md cursor-pointer transition ${
                active === "student"
                  ? "bg-[#f7f8fa] text-black"
                  : "text-gray-600"
              }`}
              onClick={() => setActive("student")}
            >
              <i className="fa fa-users" aria-hidden="true"></i> <p>Students</p>
            </li>
            {/* <li
              className={`flex gap-2 items-center p-4 rounded-md cursor-pointer transition ${
                active === "course"
                  ? "bg-[#f7f8fa] text-black"
                  : "text-gray-600"
              }`}
              onClick={() => setActive("course")}
            >
              <i className="fa fa-book" aria-hidden="true"></i>
              <p>Courses</p>
            </li> */}
            <li
              className={`flex gap-2 items-center p-4 rounded-md cursor-pointer transition ${
                active === "enroll"
                  ? "bg-[#f7f8fa] text-black"
                  : "text-gray-600"
              }`}
              onClick={() => setActive("enroll")}
            >
              <i className="fa fa-folder-open" aria-hidden="true"></i>
              <p>Course Enroll</p>
            </li>
          </ul>
        </div>
        <div>
          <h1 className="text-lg font-semibold">General</h1>
          <ul className="flex flex-col gap-2">
            <li
              className={`flex gap-2 items-center p-4 rounded-md cursor-pointer transition ${
                active === "setting"
                  ? "bg-black text-gray-200"
                  : "text-gray-600"
              }`}
              onClick={() => setActive("setting")}
            >
              <i className="fa-solid fa-gear"></i>
              <p>Settings</p>
            </li>
            <li
              className={`flex gap-2 items-center p-4 rounded-md cursor-pointer transition text-red-500`}
              onClick={() => logOut()}
            >
              <i className="fa fa-sign-out" aria-hidden="true"></i>
              <p className="">Log Out</p>
            </li>
            <li
              className={`flex gap-2 items-center p-4 rounded-md cursor-pointer transition ${
                active === "help" ? "bg-black text-gray-200" : "text-gray-600"
              }`}
              onClick={() => {
                setActive("help");
                navigate.back();
              }}
            >
              <i className="fa fa-arrow-left"></i>
              <p>Back</p>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col w-full p-2 gap-4">
        <div
          className={`flex p-4 rounded-md items-center justify-between ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h1 className="text-xl font-semibold">
            {active == "instructor" && "Instuctors"}
            {active == "student" && "Students"}
            {active == "course" && "Courses"}
            {active == "enroll" && "Course Enroll"}
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative bg-[#f7f8fa]  p-2 rounded-md">
              <input
                type="search"
                placeholder="Search here"
                className="pl-8 focus:ring-blue-500 text-sm w-full outline-none bg-transparent "
              />
              <i className="fa fa-search absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500"></i>
            </div>
            {(active === "instructor" || active === "student") && (
              <div
                className="  bg-[#f7f8fa] p-2 px-4 rounded-md cursor-pointer"
                title="Add"
                onClick={() => {
                  setPopUp((prev) => ({ ...prev, user_pop: true }));
                }}
              >
                Add User
              </div>
            )}
            {active === "course" && (
              <div
                className="  bg-[#f7f8fa] p-2 px-4 rounded-md cursor-pointer"
                title="Add"
              >
                Add Course
              </div>
            )}
            {active === "enroll" && (
              <div
                className="  bg-[#f7f8fa] p-2 px-4 rounded-md cursor-pointer"
                title="Add"
                onClick={() => {
                  setPopUp((prev) => ({ ...prev, course_pop: true }));
                }}
              >
                Add Course
              </div>
            )}
          </div>
        </div>

        {active === "instructor" && <Instructors />}
        {active === "student" && <Students />}
        {active === "course" && <Courses />}
        {active === "enroll" && <Enrollments />}

        {popUp.user_pop && (
          <div className="backdrop-blur-sm fixed top-0 left-0 h-screen w-screen grid place-content-center  ">
            <div
              className="fixed right-5 top-5 "
              onClick={() => {
                setPopUp((prev) => ({ ...prev, user_pop: false }));
              }}
            >
              <i
                className="fa fa-times text-[25px] cursor-pointer"
                aria-hidden="true"
              ></i>
            </div>

            <div
              className={`p-4  ${
                darkMode ? "bg-gray-800" : "bg-white shadow-md"
              } rounded-md`}
            >
              <h1 className="text-2xl font-semibold mb-4">Add a user</h1>
              <form className="flex gap-4">
                <div className="w-1/2 flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="title">Name</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Name"
                      className="p-2 bg-gray-100 outline-none rounded-md focus:ring-blue-500 focus:ring-2"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="title">Role</label>
                    <select
                      name=""
                      id=""
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="p-2 bg-gray-100 outline-none rounded-md focus:ring-blue-500 focus:ring-2"
                    >
                      <option value="" disabled defaultValue={""}>
                        select role
                      </option>
                      <option value="student">student</option>
                      <option value="instructor">instuctor</option>
                    </select>
                  </div>

                  <button
                    onClick={addUser}
                    className="p-4 bg-green-700 text-white rounded-sm"
                  >
                    {isLoading ? "..Adding" : "Add"}
                  </button>
                </div>
                <div className="w-1/2 flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="supplier">Email</label>
                    <input
                      type="email"
                      id="supplier"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      name="supplier"
                      placeholder=" Email"
                      className="p-2 bg-gray-100 outline-none rounded-md focus:ring-blue-500 focus:ring-2"
                    />
                  </div>
                  {role === "student" && (
                    <div className="flex flex-col gap-1">
                      <label htmlFor="price">Enrollment Date</label>
                      <input
                        type="text"
                        id="price"
                        name="price"
                        onChange={(e) => setDateNow(e.target.value)}
                        value={dateNow}
                        placeholder="Product Price"
                        className="p-2 bg-gray-100 outline-none rounded-md focus:ring-blue-500 focus:ring-2"
                      />
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
        {popUp.course_pop && (
          <div className="backdrop-blur-sm fixed top-0 left-0 h-screen w-screen grid place-content-center  ">
            <div
              className="fixed right-5 top-5 "
              onClick={() => {
                setPopUp((prev) => ({ ...prev, course_pop: false }));
              }}
            >
              <i
                className="fa fa-times text-[25px] cursor-pointer"
                aria-hidden="true"
              ></i>
            </div>

            <div
              className={`p-4  ${
                darkMode ? "bg-gray-800" : "bg-white shadow-md"
              } rounded-md`}
            >
              <h1 className="text-2xl font-semibold mb-4">Add a Course</h1>
              <form className="flex gap-4">
                <div className="w-1/2 flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <div>
                      <label
                        htmlFor="course-duration"
                        className="block text-gray-700 text-sm font-medium mb-1"
                      >
                        Course Duration (months)
                      </label>
                      <input
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        id="course-duration"
                        type="number"
                        min="1"
                        placeholder="e.g  6 (months)"
                        className="w-full p-2 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    onClick={addCourse}
                    className="p-4 bg-green-700 text-white rounded-sm"
                  >
                    Add
                  </button>
                </div>
                <div className="w-1/2 flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="supplier">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      id="course-category"
                      className="w-full bg-gray-100 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Web development">Web Development</option>
                      <option value="Cyber security">Cyber Security</option>
                      <option value="Graphic design">Graphic Design</option>
                      <option value="Digital marketing">
                        Digital marketing
                      </option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
        {popUp.enroll_pop && (
          <div
            className="fixed inset-0 z-10 flex items-center justify-center p-4 backdrop-blur-sm  bg-opacity-50 transition-opacity"
            aria-labelledby="enroll-modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-3xl p-6">
              <button
                onClick={() => {
                  setPopUp((prev) => ({ ...prev, enroll_pop: false }));
                }}
                className="absolute top-4 right-4 rounded-full  p-2 focus:outline-none"
                aria-label="Close"
              >
                <i className="fa fa-times" aria-hidden="true"></i>{" "}
              </button>

              <div className="space-y-6">
                <h2
                  id="enroll-modal-title"
                  className="text-xl font-semibold text-gray-900"
                >
                  Enroll Students and Instructors
                </h2>

                {/* Course Selection */}
                <div className="space-y-2">
                  <label
                    htmlFor="course-select"
                    className="text-sm font-medium text-gray-700"
                  >
                    Select Course
                  </label>
                  <select
                    id="course-select"
                    // onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2 shadow-sm outline-none focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">{selectedCourseName}</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="text-md font-medium text-gray-800">
                      Students
                    </h3>
                    <ul className="space-y-1 max-h-48 overflow-y-auto border rounded-md p-3 bg-gray-50">
                      {students.map((student) => (
                        <li
                          key={student._id}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student._id)}
                            onChange={() =>
                              toggleSelection(
                                student._id,
                                selectedStudents,
                                setSelectedStudents
                              )
                            }
                            className="text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm capitalize++ text-gray-700">
                            {student.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-md font-medium text-gray-800">
                      Instructors
                    </h3>
                    <ul className="space-y-1 max-h-48 overflow-y-auto border rounded-md p-3 bg-gray-50">
                      {instructors.map((instructor) => (
                        <li
                          key={instructor._id}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            checked={selectedInstructors.includes(
                              instructor._id
                            )}
                            onChange={() =>
                              toggleSelection(
                                instructor._id,
                                selectedInstructors,
                                setSelectedInstructors
                              )
                            }
                            className="text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-700">
                            {instructor.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-4">
                  <button
                    onClick={() =>
                      setPopUp((prev) => ({ ...prev, enroll_pop: false }))
                    }
                    className="inline-flex justify-center rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-300 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEnroll}
                    disabled={!selectedCourse}
                    className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Enroll Selected
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
