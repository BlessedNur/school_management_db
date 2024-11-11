"use client";
import { authProvider } from "@/context/AuthContext";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import DeleteAlert from "../deleteAlert/DeleteAlert";
import Pagination from "../pagination/Pagination";

function Students() {
  const [popUp, setPopUp] = useState({
    delete_pop: false,
    studentId: null,
  });

  const [
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
  ] = useContext(authProvider);

  const [students, setStudents] = useState([]);
  const [enrolled, setEnrolled] = useState([]);

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
      setEnrolled(data);
    } catch (error) {
      console.error("Error fetching Courses:", error);
      toast.error("Failed to fetch courses");
    }
  };

  const getStudents = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/users/students", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const deleteStudent = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/users/students/${id}`,
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
  }, [popUp_user_pop]);

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
                <th className="p-3 w-full text-left border-b-[1px]">Actions</th>
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
                        <h2>{student.name}</h2>
                        <p className="text-[10px] text-gray-400">Student</p>
                      </div>
                    </td>
                    <td className="overflow-hidden flex flex-col justify-center p-3 w-full border-b-[1px] border-r-[1px]">
                      {student._id.slice(0, 15)}...
                    </td>
                    <td className="flex flex-col justify-center p-3 w-full border-b-[1px] border-r-[1px] overflow-hidden">
                      {new Date(student.enrollmentDate).toLocaleDateString()}
                    </td>
                    <td className="flex flex-col justify-center p-3 w-full border-b-[1px] border-r-[1px] overflow-hidden">
                      {studentCourses.length > 0
                        ? studentCourses.join(", ")
                        : "No courses assigned"}
                    </td>
                    <td className="flex flex-col justify-center p-3 w-full border-b-[1px] border-r-[1px] overflow-hidden">
                      {student.email}
                    </td>
                    <td className="p-3 w-full flex items-center gap-4 border-b-[1px]">
                      <div
                        className="flex items-center gap-2 bg-cyan-700 p-2 rounded-md text-[10px] text-white cursor-pointer"
                        onClick={() => copyToClipboard(student._id)}
                      >
                        <i className="fa fa-copy" aria-hidden="true"></i>
                        <p>Copy ID</p>
                      </div>
                      {popUp.delete_pop && popUp.studentId === student._id && (
                        <DeleteAlert
                          function_call={deleteStudent}
                          id={student._id}
                          role={student.role}
                          user={student.name}
                          setPopup={setPopUp}
                          delete_pop={popUp.delete_pop}
                        />
                      )}
                      <div
                        onClick={() => {
                          setPopUp((prev) => ({
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination />
      </div>
    </div>
  );
}

export default Students;
