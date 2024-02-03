import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";



const AvatarDropdown = ({ userData }) => {
  const navigate = useNavigate();
  const { firstName, lastName } = userData;
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownOpen((prev) => !prev);
  };

  function userLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  }

  if (!userData) {
    return null; 
  }
  
  

  

  return (
    <div className="relative">
      {/* Avatar button */}
      <div
        id="avatarButton"
        type="button"
        data-dropdown-toggle="userDropdown"
        data-dropdown-placement="bottom-start"
        className="w-8 h-8 rounded-full cursor-pointer"
        onClick={handleDropdownToggle}
      >
        {/* Replace image with SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          className="w-full h-full text-blue-500" // You can customize the color here
        >
          <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
        </svg>
      </div>

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div
          id="userDropdown"
          className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600 absolute top-12 right-0"
        >
          <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
            <div>Welcome</div>
            <div className="font-medium truncate">{`${firstName} ${lastName}!`}</div>
          </div>
          <ul className="py-2 text-md text-gray-900 dark:text-gray-200">
            <li>
              <Link
              to="/profile" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">
                Your Account
              </Link>
            </li>
	          <li>
              <Link to="/videoupload" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">
                Upload
              </Link>
            </li>
            <li>
              <Link to="/videogallery" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">
                Video Gallery
              </Link>
            </li>
            <li>
              <Link to="/videosearch" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">
                Video Search
              </Link>
            </li>
            <li>
              <Link to="/videoclassify" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">
                Video Classify
              </Link>
            </li>
            <li>
              <Link to="/analytics" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">
                Analytics
              </Link>
            </li>
          </ul>
          <div className="py-1">
          <button onClick={userLogout} className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                    Logout
                  </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarDropdown;
