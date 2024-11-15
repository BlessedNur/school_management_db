"use client";
import { authProvider } from "@/context/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import Pagination from "../pagination/Pagination";
import { toast } from "sonner";
import DeleteAlert from "../deleteAlert/DeleteAlert";

function Enrollments() {
  const [courseList, setCourseList] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [popUp2, setPopUp2] = useState({
    delete_pop: false,
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
    selectedCourse,
    setSelectedCourse,
    selectedCourseName,
    setSelectedCourseName,
  } = useContext(authProvider);

  const getCourses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://school-management-db-backend.onrender.com/api/courses/get_course",
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        setIsLoading(false);
      }
      const data = await response.json();
      console.log("Courses Data:", data);
      setCourseList(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching Courses:", error);
      toast.error("Failed to fetch courses");
    }
  };

  const getUsers = async () => {
    try {
      const response = await fetch(
        "https://school-management-db-backend.onrender.com/api/users/get_users",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log("Instructors Data:", data.instructors);
        setInstructors(data.instructors);
      } else {
        console.error("Failed to fetch instructors data");
      }
    } catch (error) {
      console.error("Error fetching instructors:", error);
    }
  };

  const deleteCourse = async (id) => {
    try {
      const response = await fetch(
        `https://school-management-db-backend.onrender.com/api/courses/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        setCourseList((prevCourses) =>
          prevCourses.filter((course) => course._id !== id)
        );
        toast.info("Course deleted successfully");
      } else {
        toast.error("Error deleting Course");
      }
    } catch (error) {
      console.error("Error deleting Course:", error);
    } finally {
      setPopUp2({ delete_pop: false, courseId: null });
    }
  };

  useEffect(() => {
    getCourses();
    getUsers();
  }, [popUp.enroll_pop]);

  useEffect(() => {
    getCourses();
  }, [popUp.course_pop]);

  useEffect(() => {
    const enrolledInstructorIds = courseList.flatMap(
      (item) => item.enrolledInstructors || []
    );
    setEnrolled(enrolledInstructorIds);
  }, [courseList]);

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
                <tr className="flex text-gray-500 justify-between ">
                  <th className="p-3 w-full text-left border-b-[1px] border-r-[1px]">
                    Course
                  </th>
                  <th className="p-3 w-full text-left border-b-[1px] border-r-[1px]">
                    Instructor(s)
                  </th>
                  <th className="p-3 w-full text-left border-b-[1px] border-r-[1px]">
                    Duration
                  </th>
                  <th className="p-3 w-full text-left border-b-[1px] ">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {courseList.map((course, index) => (
                  <tr key={index} className="flex justify-between">
                    <td className="flex flex-col justify-center p-3 w-full border-b-[1px] border-r-[1px] overflow-hidden">
                      {course.category}
                    </td>
                    <td className="flex flex-col justify-center p-3 w-full border-b-[1px] border-r-[1px] overflow-hidden">
                      {instructors
                        .filter((instructor) =>
                          course.enrolledInstructors.includes(instructor._id)
                        )
                        .map((instructor) => instructor.name)
                        .join(", ") || "No instructor assigned"}
                    </td>
                    <td className="flex flex-col justify-center p-3 w-full border-b-[1px] border-r-[1px] overflow-hidden">
                      {course.duration} Months
                    </td>

                    <td className="p-3 w-full flex items-center gap-4 border-b-[1px]">
                      <div
                        className="cursor-pointer flex items-center gap-2 bg-cyan-700 p-2 rounded-md text-[10px] text-white"
                        onClick={() => {
                          setPopUp((prev) => ({ ...prev, enroll_pop: true }));
                          setSelectedCourse(course._id);
                          setSelectedCourseName(course.category);
                        }}
                      >
                        <i className="fa fa-plus" aria-hidden="true"></i>
                        <p>Enroll</p>
                      </div>
                      {popUp2.delete_pop && popUp2.courseId === course._id && (
                        <DeleteAlert
                          function_call={deleteCourse}
                          id={course._id}
                          role={"course"}
                          user={course.category}
                          setPopup={setPopUp2}
                          delete_pop={popUp2.delete_pop}
                        />
                      )}
                      <div
                        onClick={() =>
                          setPopUp2({ delete_pop: true, courseId: course._id })
                        }
                        className="cursor-pointer flex items-center gap-2 bg-red-600 p-2 rounded-md text-[10px] text-white"
                      >
                        <i className="fa fa-trash" aria-hidden="true"></i>
                        <p>Delete</p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <Pagination />
      </div>
    </div>
  );
}

export default Enrollments;
