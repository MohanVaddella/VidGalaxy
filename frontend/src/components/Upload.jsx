import React, { useState } from "react";

const Upload = () => {
  const [videos, setVideos] = useState([]);

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const newVideos = [...videos];
      for (let i = 0; i < files.length; i++) {
        newVideos.push(files[i]);
      }
      setVideos(newVideos);
    }
  };

  const handleRemoveVideo = (index) => {
    const updatedVideos = [...videos];
    updatedVideos.splice(index, 1);
    setVideos(updatedVideos);
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <label
        htmlFor="upload"
        className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
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
        {videos.map((video, index) => (
          <div key={index} className="m-2 w-64">
            <div className="relative group">
              <video
                src={URL.createObjectURL(video)}
                controls
                className="h-36 w-full object-cover rounded-lg cursor-pointer transition duration-300 transform hover:scale-105"
              />
              <button
                className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-2/3 bg-red-500 text-white py-1 px-3 rounded-md opacity-0 group-hover:opacity-100 transition duration-300"
                onClick={() => handleRemoveVideo(index)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Upload;
