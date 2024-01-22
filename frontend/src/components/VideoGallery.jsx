import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Header from "./Header";
import Footer from "./Footer";
import { useAuthStore } from "../store/store";
import { getVideos } from "../helper/helper";


const VideoGallery = () => {
  const [videos, setVideos] = useState([]);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);

  const ffmpeg = require('@ffmpeg/ffmpeg');
  

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
  /* console.log(username); */
  useEffect(() => {

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
}, [username, ffmpegLoaded]);

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <Header />
      <section
        className="bg-gradient-to-r from-purple-500 via-blue-400 to-purple-500"
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
                  {videos.map((video) => (
                    <div key={video._id} className="mb-8">
                      <div className="relative rounded-lg overflow-hidden">
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
