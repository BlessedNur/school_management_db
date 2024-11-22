"use client";
import { authProvider } from "@/context/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import Pagination from "../pagination/Pagination";
import { toast } from "sonner";
import DeleteAlert from "../deleteAlert/DeleteAlert";
import moment from "moment";

function Courses() {
  const [courseList, setCourseList] = useState([]);
  const [students, setStudents] = useState([]);
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
  // const { duration, setDuration } = useState("");
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
        setIsLoading(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
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
        console.log("students Data:", data.students);
        setStudents(data.students);
      } else {
        console.error("Failed to fetch students data");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
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
  }, [popUp.course_pop, popUp.update_course_pop]);

  useEffect(() => {
    const enrolledStudentsId = courseList.flatMap(
      (item) => item.enrolledStudentsId || []
    );
    setEnrolled(enrolledStudentsId);
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
                    Course Name
                  </th>
                  <th className="p-3 w-full text-left border-b-[1px] border-r-[1px]">
                    Course
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
                {courseList.map((course, index) => {
                  const endDate = course.endAt;
                  const length = "days";
                  const durationDate = moment(endDate).diff(
                    course.startFrom,
                    length
                  );
                  return (
                    <tr key={index} className="flex justify-between">
                      <td className="flex flex-col justify-center p-3 w-full border-b-[1px] border-r-[1px] overflow-hidden">
                        {course.name}
                      </td>
                      <td className="flex flex-col justify-center p-3 w-full border-b-[1px] border-r-[1px] overflow-hidden">
                        {course.category}
                      </td>

                      <td className="flex flex-col justify-center p-3 w-full border-b-[1px] border-r-[1px] overflow-hidden">
                        {durationDate} {length}
                      </td>

                      <td className="p-3 w-full flex items-center gap-4 border-b-[1px]">
                        <div
                          className="cursor-pointer flex items-center gap-2 bg-cyan-700 p-2 rounded-md text-[10px] text-white"
                          onClick={() => {
                            setPopUp((prev) => ({
                              ...prev,
                              course_view_pop: true,
                            }));
                            setSelectedCourse(course);
                          }}
                        >
                          <p>View</p>
                        </div>
                        <div
                          className="cursor-pointer flex items-center gap-2 bg-orange-700 p-2 rounded-md text-[10px] text-white"
                          onClick={() => {
                            setPopUp((prev) => ({
                              ...prev,
                              update_course_pop: true,
                            }));
                            setSelectedCourse(course);
                          }}
                        >
                          <p>Update</p>
                        </div>
                        {popUp2.delete_pop &&
                          popUp2.courseId === course._id && (
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
                            setPopUp2({
                              delete_pop: true,
                              courseId: course._id,
                            })
                          }
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
          )}
        </div>
        <Pagination />
      </div>
    </div>
  );
}

export default Courses;
