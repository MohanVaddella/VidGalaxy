import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import HeaderOne from "./HeaderOne";
import Footer from "./Footer";
import { useAuthStore } from "../store/store";
import { useFormik } from "formik";
import { uploadValidation } from "../helper/validate";
import { uploadFile } from "../helper/helper";

const VideoUpload = () => {
  const { username } = useAuthStore((state) => state.auth);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");

  const formik = useFormik({
    initialValues: {
      title: "",
      videoFile: null,
    },
    validate: uploadValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      /* console.log("Form values:", values); */
      values = await Object.assign(values, { username });
      try {
        const uploadResponse = await uploadFile(values);

        if (uploadResponse.status === 200) {
          setUploadedFileUrl(uploadResponse.data.fileUrl);
          toast.success("File uploaded successfully");
        } else {
          toast.error("Failed to upload file.");
        }
      } catch (error) {
        // Handle any unexpected errors
        toast.error("Check if the video is already uploaded.");
      }
    },
  });
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    formik.setFieldValue("videoFile", selectedFile);
    setSelectedFileName(selectedFile.name);
  };
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <HeaderOne />
      <section
        className="bg-gradient-to-r from-purple-500 via-blue-400 to-purple-500"
        style={{ padding: "6.5rem" }}
      >
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Upload ISRO Documentaries
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={formik.handleSubmit}
                encType="multipart/form-data"
              >
                <div>
                  <label
                    htmlFor="title"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Title
                  </label>
                  <input
                    {...formik.getFieldProps("title")}
                    type="text"
                    name="title"
                    id="title"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter the title"
                    required
                  />
                </div>
                <label
                  htmlFor="upload"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Upload
                </label>
                <div className="flex items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center pt-5 pb-6"
                  >
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                  </label>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept="video/*"
                    onChange={handleFileChange}
                    required
                  />
                </div>
                {/* New section to display selected file */}
                {selectedFileName && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <b>Selected File:</b> {selectedFileName}
                    </p>
                  </div>
                )}

                {/* Upload Button */}
                <div className="flex items-center justify-center">
                  <button
                    type="submit"
                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default VideoUpload;
