import { authProvider } from "@/context/AuthContext";
import React, { useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import DeleteAlert from "../deleteAlert/DeleteAlert";
import Pagination from "../pagination/Pagination";

function Instructors() {
  const [popUp2, setPopUp2] = useState({
    delete_pop: false,
    instructorId: null,
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
  const [instructors, setInstructors] = useState([]);
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
        setIsLoading(false);

        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setEnrolled(data);
    } catch (error) {
      console.error("Error fetching Courses:", error);
      toast.error("Failed to fetch courses");
    }
  };

  const getInstructors = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://school-management-db-backend.onrender.com/api/users/instructors",
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        setIsLoading(false);

        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      if (response.ok) {
        setIsLoading(false);

        const data = await response.json();
        setInstructors(data);
      }
    } catch (error) {
      setIsLoading(false);

      console.error("Error fetching instructors:", error);
    }
  };

  useEffect(() => {
    getInstructors();
    getCourses();
  }, [popUp.user_pop]);

  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id).then(() => {
      toast.info("Instructor ID copied to clipboard!");
    });
  };

  const deleteInstructor = async (id) => {
    try {
      const response = await fetch(
        `https://school-management-db-backend.onrender.com/api/users/instructors/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setInstructors((prevInstructors) =>
          prevInstructors.filter((instructor) => instructor._id !== id)
        );
        toast.info("Instructor deleted successfully");
      } else {
        toast.error("Error deleting instructor");
      }
    } catch (error) {
      console.error("Error deleting instructor:", error);
    } finally {
      setPopUp2({ delete_pop: false, instructorId: null });
    }
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
                    Name
                  </th>
                  <th className="p-3 w-full text-left border-b-[1px] border-r-[1px]">
                    Teacher ID
                  </th>
                  <th className="p-3 w-full text-left border-b-[1px] border-r-[1px]">
                    Course
                  </th>
                  <th className="p-3 w-full text-left border-b-[1px] border-r-[1px]">
                    Email
                  </th>
                  <th className="p-3 w-full text-left border-b-[1px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {instructors.map((instructor) => {
                  const instructorCourses = enrolled
                    .filter((course) =>
                      course.enrolledInstructors.includes(instructor._id)
                    )
                    .map((course) => course.category);

                  return (
                    <tr key={instructor._id} className="flex justify-between">
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
                            popUp2.instructorId === instructor._id && (
                              <DeleteAlert
                                function_call={deleteInstructor}
                                id={instructor._id}
                                role={instructor.role}
                                user={instructor.name}
                                setPopup={setPopUp2}
                                delete_pop={popUp2.delete_pop}
                              />
                            )}
                          <h2>{instructor.name}</h2>
                          <p className="text-[10px] text-gray-400">
                            Instructor
                          </p>
                        </div>
                      </td>
                      <td className="flex flex-col justify-center p-3 w-full border-b-[1px] border-r-[1px] overflow-hidden">
                        {instructor._id}
                      </td>
                      <td className="flex flex-col justify-center p-3 w-full border-b-[1px] border-r-[1px] overflow-hidden">
                        {instructorCourses.length > 0
                          ? instructorCourses.join(", ")
                          : "No courses assigned"}
                      </td>
                      <td className="flex flex-col justify-center p-3 w-full border-b-[1px] border-r-[1px] overflow-hidden">
                        {instructor.email}
                      </td>
                      <td className="p-3 w-full flex items-center gap-4 border-b-[1px]">
                        <div
                          className="flex items-center gap-2 whitespace-nowrap bg-cyan-700 p-2 rounded-md text-[10px] text-white cursor-pointer"
                          onClick={() => copyToClipboard(instructor._id)}
                        >
                          <i className="fa fa-copy" aria-hidden="true"></i>
                          <p>Copy ID</p>
                        </div>
                        <div
                          className="flex items-center gap-2 bg-red-600 p-2 rounded-md text-[10px] text-white cursor-pointer"
                          onClick={() =>
                            setPopUp2({
                              delete_pop: true,
                              instructorId: instructor._id,
                            })
                          }
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

export default Instructors;
