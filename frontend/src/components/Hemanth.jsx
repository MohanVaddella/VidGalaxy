// Hemanth.jsx
import React, { useState } from "react";
import TheaterModal from "./TheaterModel";

function Hemanth() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const newVideos = [...videos];
      for (let i = 0; i < files.length; i++) {
        const uniqueId = Date.now() + i;
        newVideos.push({ id: uniqueId, file: files[i] });
      }
      setVideos(newVideos);
    }
  };

  const handleRemoveVideo = (id) => {
    const updatedVideos = videos.filter((video) => video.id !== id);
    setVideos(updatedVideos);
    if (selectedVideo && selectedVideo.id === id) {
      setSelectedVideo(null);
    }
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setShowModal(true);
  };

  const closeTheaterMode = () => {
    setShowModal(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <label
        htmlFor="upload"
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded cursor-pointer"
      >
        Upload Video
      </label>
      <input
        id="upload"
        type="file"
        className="hidden"
        accept="video/*"
        multiple
        onChange={handleFileUpload}
      />

      <div className="mt-8 flex flex-wrap justify-center">
        {videos.map((video) => (
          <div
            key={video.id}
            className="m-2 w-64"
            onClick={() => handleVideoClick(video)}
          >
            <div className="relative group">
              <video
                src={URL.createObjectURL(video.file)}
                controls
                className="h-36 w-full object-cover rounded-lg cursor-pointer transition duration-300 transform hover:scale-105"
              />
              <button
                className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-2/3 bg-red-500 text-white py-1 px-3 rounded-md opacity-0 group-hover:opacity-100 transition duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveVideo(video.id);
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Display the modal if showModal state is true */}
      {showModal && (
        <TheaterModal
          selectedVideo={selectedVideo}
          videos={videos}
          onClose={closeTheaterMode}
        />
      )}
    </div>
  );
}

export default Hemanth;
