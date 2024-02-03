import React, { useEffect } from "react";
/* import { useNavigate } from "react-router-dom"; */

const VideoClassify = () => {
    /* const navigate = useNavigate(); */

    useEffect(() => {
        // Redirect to the specified endpoint
        /* navigate("http://localhost:80/"); */
        window.location.href = "http://localhost:80/search";
    }, []);

    return (
    <div>
      {/* Add your Video Classify component content here */}
        {/* <h2>Video Classify Page</h2> */}
      {/* Add more components or content as needed */}
    </div>
    );
};

export default VideoClassify;

