"use client";
import { authProvider } from "@/context/AuthContext";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import DeleteAlert from "../deleteAlert/DeleteAlert";
import Pagination from "../pagination/Pagination";
import moment from "moment";

function Students() {
  const [popUp2, setPopUp2] = useState({
    delete_pop: false,
    studentId: null,
  });

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
  const [isLoading, setIsLoading] = useState(false);

  const [students, setStudents] = useState([]);
  const [enrolled, setEnrolled] = useState([]);

  const getCourses = async () => {
    try {
      const response = await fetch(
        "https://school-management-db-backend.onrender.com/api/courses/get_course",
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setEnrolled(data);
    } catch (error) {
      console.error("Error fetching Courses:", error);
      toast.error("Failed to fetch courses");
    }
  };

  const getStudents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://school-management-db-backend.onrender.com/api/users/students",
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        setIsLoading(false);

        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setStudents(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      console.error("Error fetching students:", error);
    }
  };

  const deleteStudent = async (id) => {
    try {
      const response = await fetch(
        `https://school-management-db-backend.onrender.com/api/users/students/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setStudents((prevStudents) =>
          prevStudents.filter((student) => student._id !== id)
        );
        toast.info("Student deleted successfully");
      } else {
        toast.error("Error deleting student");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  useEffect(() => {
    getStudents();
    getCourses();
  }, [popUp.user_pop]);

  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id).then(() => {
      toast.info("Student ID copied to clipboard!");
    });
  };

  return (
    <div className="grid gap-4 w-full overflow-y-auto h-full">
      <div className="flex-1 w-full flex flex-col gap-4">
        <div
          className={`${
            darkMode ? "bg-gray-900" : "bg-white"
          } rounded-sm h-full w-full`}
        >
          {isLoading ? (
            <div className="w-full h-full flex justify-center items-center gap-4">
              <div className="loader w-8 h-8 border-4 border-[#000] rounded-full"></div>
              <h4 className="font-semibold">Please wait...</h4>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="flex text-gray-500 justify-between">
                  <th className="p-3 w-full text-left border-b-[1px] border-r-[1px]">
                    Profile
                  </th>
                  <th className="p-3 w-full text-left border-b-[1px] border-r-[1px]">
                    StudentID
                  </th>
                  <th className="p-3 w-full text-left border-b-[1px] border-r-[1px]">
                    Enroll Date
                  </th>
                  <th className="p-3 w-full text-left border-b-[1px] border-r-[1px]">
                    Course
                  </th>
                  <th className="p-3 w-full text-left border-b-[1px] border-r-[1px]">
                    Email
                  </th>
                  {currentUser.role === "admin" && (
                    <th className="p-3 w-full text-left border-b-[1px]">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const studentCourses = enrolled
                    .filter((course) =>
                      course.enrolledStudents.includes(student._id)
                    )
                    .map((course) => course.category);

                  return (
                    <tr key={student._id} className="flex justify-between">
                      <td className="p-3 w-full border-b-[1px] border-r-[1px] flex items-center gap-3 capitalize">
                        <div className="w-10 h-10 rounded-full bg-gray-400 overflow-hidden">
                          <img
                            src={
                              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                            }
                            width={"100%"}
                            height={"100%"}
                          />
                        </div>
                        <div>
                          {popUp2.delete_pop &&
                            popUp2.studentId === student._id && (
                              <DeleteAlert
                                function_call={deleteStudent}
                                id={student._id}
                                role={student.role}
                                user={student.name}
                                setPopup={setPopUp2}
                                delete_pop={popUp2.delete_pop}
                              />
                            )}
                          <h2>{student.name}</h2>
                          <p className="text-[10px] text-gray-400">Student</p>
                        </div>
                      </td>
                      <td className="overflow-hidden flex flex-col justify-center p-3 w-full border-b-[1px] border-r-[1px]">
                        {student._id.slice(0, 15)}...
                      </td>
                      <td className="flex flex-col justify-center p-3 w-full border-b-[1px] border-r-[1px] overflow-hidden">
                        <h2>
                          {moment(student.enrollmentDate).format("MMM Do YY")}
                        </h2>
                        <p className="text-[10px] text-gray-400">
                          {moment(student.createdAt).fromNow()}{" "}
                        </p>
                      </td>

                      <td className="flex flex-col justify-center p-3 w-full border-b-[1px] border-r-[1px] overflow-hidden">
                        {studentCourses.length > 0
                          ? studentCourses.join(", ")
                          : "No courses assigned"}
                      </td>
                      <td className="flex flex-col justify-center p-3 w-full border-b-[1px] border-r-[1px] overflow-hidden">
                        {student.email}
                      </td>
                      {currentUser.role === "admin" && (
                        <td className="p-3 w-full flex  items-center gap-4 border-b-[1px]">
                          <div
                            className="flex  items-center gap-2 whitespace-nowrap bg-cyan-700 p-2 rounded-md text-[10px] text-white cursor-pointer"
                            // onClick={() => copyToClipboard(student._id)}
                          >
                            <i className="fa fa-copy" aria-hidden="true"></i>
                            <p>Update</p>
                          </div>

                          <div
                            onClick={() => {
                              setPopUp2((prev) => ({
                                ...prev,
                                delete_pop: true,
                                studentId: student._id,
                              }));
                            }}
                            className="cursor-pointer flex items-center gap-2 bg-red-600 p-2 rounded-md text-[10px] text-white"
                          >
                            <i className="fa fa-trash" aria-hidden="true"></i>
                            <p>Delete</p>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <Pagination />
      </div>
    </div>
  );
}

export default Students;
