import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Header from "./Header";
import Footer from "./Footer";
import { useAuthStore } from "../store/store";
import { getVideos } from "../helper/helper";

const VideoGallery = () => {
  const [videos, setVideos] = useState([]);
  const { username } = useAuthStore((state) => state.auth);
  console.log(username);
  useEffect(() => {
    // Fetch videos when the component mounts
    receiveVideos();
  }, [username]);

  const receiveVideos = async () => {
    try {
      if (!username) {
        toast.error("Username is required.");
        return;
      }
      // Call the helper function to get videos
      const response = await getVideos(username);
      console.log(username);
      if (response.status === 200) {
        setVideos(response.data); // Update the videos state
      } else {
        toast.error("Failed to fetch videos.");
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <Header />
      <section className="bg-gradient-to-r from-purple-500 via-blue-400 to-purple-500">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Your ISRO Documentaries
              </h1>
              {/* Display videos */}
              {videos.length > 0 ? (
                <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {videos.map((video) => (
                    <div key={video._id} className="mb-4">
                      {/* Display video details as needed */}
                      <p>Title: {video.title}</p>
                      <p>Description: {video.description}</p>
                      {/* Add more details if needed */}
                    </div>
                  ))}
                </div>
                </div>
              ) : (
                <p>No videos available.</p>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default VideoGallery;
