import React, { useState } from "react";
import HeaderOne from "./HeaderOne";
import Footer from "./Footer";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { profileValidation } from "../helper/validate";

import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/fetch.hook";
/* import { useAuthStore } from "../store/store"; */
import { updateUser } from "../helper/helper";

const Profile = () => {
  const navigate = useNavigate();
  const [{ isLoading, apiData, serverError }] = useFetch();
  const [isEditingFirstName, setIsEditingFirstName] = useState(false);
  const [isEditingLastName, setIsEditingLastName] = useState(false);
  const formik = useFormik({
    initialValues: {
      firstName: apiData?.firstName || "",
      lastName: apiData?.lastName || "",
      email: apiData?.email || "",
      username: apiData?.username || "",
    },
    enableReinitialize: true,
    validate: profileValidation,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      try {
        const updatedUser = await updateUser(values);
        toast.success("Update Successful!");
        // You may choose to update the local state or refetch the user data
    } catch (error) {
        toast.error("Update Failed!");
    }
},
});

  // logout handler function
  function userLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  }

  if (isLoading) return <h1 className="text-2xl font-bold">isLoading</h1>;
  if (serverError)
    return <h1 className="text-xl text-red-500">{serverError.message}</h1>;
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <HeaderOne />
      <section className="bg-gradient-to-r from-purple-500 via-blue-400 to-purple-500">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Your Details
              </h1>

              <form onSubmit={formik.handleSubmit}>
              <div className="details">
                <div className="flex mb-2">
                  <span className="block w-1/3 text-sm font-medium text-gray-900 dark:text-white">
                    First Name:
                  </span>
                  {isEditingFirstName ? (
                      <input
                        type="text"
                        name="firstName"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        onBlur={() => setIsEditingFirstName(false)}
                      />
                    ) : (
                      <>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">
                          {formik.values.firstName}
                        </span>
                        <span
                          className="ml-1 cursor-pointer"
                          onClick={() => setIsEditingFirstName(true)}
                        >
                          ✏️
                        </span>
                      </>
                    )}
                </div>

                <div className="flex mb-2">
                  <span className="block w-1/3 text-sm font-medium text-gray-900 dark:text-white">
                    Last Name:
                  </span>
                  {isEditingLastName ? (
                      <input
                        type="text"
                        name="lastName"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        onBlur={() => setIsEditingLastName(false)}
                      />
                    ) : (
                      <>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">
                          {formik.values.lastName}
                        </span>
                        <span
                          className="ml-1 cursor-pointer"
                          onClick={() => setIsEditingLastName(true)}
                        >
                          ✏️
                        </span>
                      </>
                    )}
                </div>

                <div className="flex mb-2">
                  <span className="block w-1/3 text-sm font-medium text-gray-900 dark:text-white">
                    Email:
                  </span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    {formik.values.email}
                  </span>
                </div>

                <div className="flex mb-2">
                  <span className="block w-1/3 text-sm font-medium text-gray-900 dark:text-white">
                    Username:
                  </span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    {formik.values.username}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Update
              </button>
              </form>
              <div className="text-center py-4">
                <span className="text-gray-500">
                  Come back later?{" "}
                  <button onClick={userLogout} className="text-purple-500">
                    Logout
                  </button>
                </span>
              </div>
              
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Profile;
