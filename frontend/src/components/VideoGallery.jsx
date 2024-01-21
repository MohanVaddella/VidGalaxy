import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Header from "./Header";
import Footer from "./Footer";
import { useAuthStore } from "../store/store";
import { getVideos } from "../helper/helper";

const VideoGallery = () => {
  const [videos, setVideos] = useState([]);
  const { username } = useAuthStore((state) => state.auth);
  /* console.log(username); */
  useEffect(() => {
    // Fetch videos when the component mounts
    receiveVideos();
  }, [username]);

  const receiveVideos = async () => {
    try {
      if (!username) {
        toast.error("Login to your account!");
        return;
      }
      // Call the helper function to get videos
      const response = await getVideos(username);
      /* console.log(username); */
      if (Array.isArray(response)) {
        // Update the videos state with the array (including empty array)
        setVideos(response);
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
      <section className="bg-gradient-to-r from-purple-500 via-blue-400 to-purple-500"
      style={{ padding: "5.5rem" }}
      >
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full max-w-screen-xl mx-auto bg-white rounded-lg shadow dark:border md:mt-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <div className="flex justify-center">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Your ISRO Documentaries
                </h1>
              </div>
              {/* Display videos */}
              {videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

              {videos.map(video => (
                <div key={video._id} className="mb-8">
                  
                  <div className="relative rounded-lg overflow-hidden">
                    <div className="aspect-video">
                      <video
                        className="w-full h-full object-cover"
                        src={video.fileUrl}
                        poster="/path/to/poster.png" 
                        controls
                      >
                        <p>Your browser does not support the video element.</p>
                      </video>
                    </div>
                  </div>

                  <h3 className="mt-4 text-lg font-medium">
                    {video.title}
                  </h3>

                  <p className="text-gray-600">
                    {video.description}
                  </p>

                </div>
              ))}

            </div>
          ) : (
            <p>No videos found</p> 
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
