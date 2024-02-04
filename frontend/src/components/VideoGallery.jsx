import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import HeaderOne from "./HeaderOne";
import Footer from "./Footer";
import { useAuthStore } from "../store/store";
import { getVideos, deleteVideo } from "../helper/helper";


const VideoGallery = () => {
  const [videos, setVideos] = useState([]);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false); 

  const ffmpeg = require('@ffmpeg/ffmpeg');

  // Load FFmpeg when the component mounts
  useEffect(() => {
    const loadFfmpeg = async () => {
      try {
        await ffmpeg.load();
        setFfmpegLoaded(true);
      } catch (error) {
        console.error("Failed to load FFmpeg:", error);
      }
    };

    loadFfmpeg();
  }, [ffmpeg]);

  // Function to generate poster image
  const generatePoster = async (videoUrl) => {
    try {
      if (!ffmpegLoaded) {
        console.error("FFmpeg is not loaded yet.");
        return null;
      }

      // Read the video file
      ffmpeg.FS("writeFile", "input.mp4", await fetch(videoUrl));

      // Run ffmpeg command to generate a poster image (e.g., from the first frame)
      await ffmpeg.run(
        "-i",
        "input.mp4",
        "-ss",
        "00:00:01",
        "-frames:v",
        "1",
        "output.jpg"
      );

      // Read the generated poster image
      const posterData = ffmpeg.FS("readFile", "output.jpg");

      // Convert poster image data to a data URL
      const posterDataURL = `data:image/jpeg;base64,${posterData}`;

      return posterDataURL;
    } catch (error) {
      console.error("Error generating poster:", error);
      return null;
    }
  };

  const { username } = useAuthStore((state) => state.auth);

  // Fetch videos when the component mounts or when the username changes
  useEffect(() => {
    const receiveVideos = async () => {
      try {
        /* if (!username) {
          toast.error("Login to your account!");
          return;
      } */
        // Call the helper function to get videos
        const response = await getVideos(username);
        if (Array.isArray(response)) {
          // Update the videos state with the array (including an empty array)
          const videosWithPosters = await Promise.all(
            response.map(async (video) => {
              const poster = await generatePoster(video.fileUrl);
              return { ...video, poster };
            })
          );

          setVideos(videosWithPosters);
        } else {
          toast.error("Failed to fetch videos.");
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error);
        toast.error("An unexpected error occurred.");
      }
    };

    receiveVideos();
  }, [username]);

  // Function to handle video deletion
  const removeVideo = async (videoId) => {
    try {
      console.log(videoId);
      
      const deletionResponse = await deleteVideo(username, videoId);
      /* console.log(deletionResponse); */

      if (deletionResponse && deletionResponse.message) {
        toast.success(deletionResponse.message);

        // After deletion, update the videos state to exclude the deleted video
        setVideos((prevVideos) => prevVideos.filter((prevVideo) => prevVideo._id !== videoId));
      } else {
        toast.error("Failed to delete video");
      }
      } catch (error) {
          console.error("Error deleting video:", error);
          toast.error("An unexpected error occurred");
      }
  };

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  // Function to handle opening the share modal
  const openShareModal = (video) => {
    setSelectedVideo(video);
    setShowShareModal(true);
  };

  // Function to handle closing the share modal
  const closeShareModal = () => {
    setSelectedVideo(null);
    setShowShareModal(false);
  };

  return (
    <div>
    {showShareModal && selectedVideo && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-8 rounded-lg z-50">
      <p className="text-xl font-semibold mb-4">Share Video</p>
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={selectedVideo.fileUrl}
          readOnly
          className="flex-grow border p-2 rounded mr-2"
        />
        <button
          onClick={() => {
            navigator.clipboard.writeText(selectedVideo.fileUrl);
            toast.success("URL copied to clipboard");
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Copy
        </button>
      </div>
      <button
        onClick={closeShareModal}
        className="bg-gray-700 text-white px-4 py-2 rounded"
      >
        Close
      </button>
    </div>
  </div>
)}
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <HeaderOne />
      <section
        className="bg-gradient-to-r from-purple-500 via-blue-400 to-purple-500"
        style={{ padding: "7.5rem" }}
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
                  {videos.map((video) => (
                    <div key={video._id} className="relative mb-8">
                      <div className="rounded-lg overflow-hidden aspect-video">
                        <div className="aspect-video">
                          <video
                            className="w-full h-full object-cover"
                            src={video.fileUrl}
                            poster={video.poster}
                            controls
                            /* playsInline */
                            /* onMouseOver={(e) => {
                              e.target.play();
                            }} // Play on hover
                            onMouseOut={(e) => {
                              e.target.pause();
                            }} // Pause on mouse out */
                          >
                            <p>
                              Your browser does not support the video element.
                            </p>
                          </video>
                        </div>
                      </div>

                      <h3 className="mt-4 text-lg font-medium">
                        {video.title}
                      </h3>
                      {video.poster && (
                        <img
                          src={video.poster}
                          alt={`${video.title} Poster`}
                          className="mt-2 rounded-lg shadow"
                          style={{ maxWidth: "100%" }}
                        />
                      )}
                      <div className="inset-0 flex items-center justify-center">
                      <button
                        onClick={() => openShareModal(video)}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded mr-2"
                      >
                        Share
                      </button>
                      <button
                        onClick={() => removeVideo(video._id)}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>
              
                    </div>
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
