import React, { useState } from 'react';

const TheaterModal = ({ selectedVideo, videos, onClose }) => {
  const [currentVideo, setCurrentVideo] = useState(selectedVideo);

  const handleTheaterVideoClick = (video) => {
    setCurrentVideo(video);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-black w-full h-full flex justify-center items-center">
        <div className="bg-black p-4 rounded-lg w-4/5 h-4/5 flex flex-col relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="h-4/5 flex justify-center items-center bg-black">
            {currentVideo && (
              <video
                src={URL.createObjectURL(currentVideo.file)}
                controls
                autoPlay
                className="w-full h-full max-h-96"
              />
            )}
          </div>
          <div className="h-1/5 flex justify-start items-start overflow-x-auto bg-black mt-4">
            {videos.map((video) => (
              <div
                key={video.id}
                className="w-1/6 cursor-pointer relative mr-2"
                onClick={() => handleTheaterVideoClick(video)}
              >
                <div className="w-28 h-28 relative overflow-hidden">
                  <video
                    src={URL.createObjectURL(video.file)}
                    className="absolute inset-0 w-full h-full object-cover"
                    playsInline
                    onMouseOver={(e) => { e.target.play() }} // Play on hover
                    onMouseOut={(e) => { e.target.pause() }} // Pause on mouse out
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-white" // Changed color to white
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M17.2969 12.0002L10.7969 16.7302C10.5313 16.9185 10.2422 17.0011 9.95312 17.0011C9.67187 17.0011 9.39062 16.9185 9.125 16.7302C8.79688 16.5102 8.57812 16.1602 8.57812 15.8352V8.16518C8.57812 7.84018 8.79688 7.49018 9.125 7.27018C9.45312 7.05018 9.89062 7.05018 10.2188 7.27018L17.2969 12.0002Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheaterModal;
