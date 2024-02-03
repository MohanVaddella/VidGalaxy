import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Services from "./Services";
import Rocket from "../assets/rocket.png";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/register"); 
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Gradient Background */}
      <div className="flex-1 bg-gradient-to-r from-purple-500 via-blue-400 to-purple-500">
        {/* Content of your home page goes here */}
        <div className="container mx-auto py-16 px-10 flex justify-center items-center text-white">
        <div className="w-70 pr-8">
          <h1 className="text-4xl font-bold mb-4">Unlock the Cosmos of Video Discovery with ISRO's <b><i>VidGalaxy</i></b></h1>
          {/* Sub-headline */}
          <h2 className="text-lg">
            Revolutionizing Space Exploration through Personalized Video Experiences and Intelligent Recommendations
          </h2>
          <button
                className="mt-8 px-4 py-2 bg-gray-700 text-white rounded"
                onClick={handleClick}
              >
                Get Started!
              </button>
          </div>
          <div className="w-30 rounded-lg overflow-hidden mt-9 ml-8 ring ring-white ring-2 shadow-lg">
            <img src={Rocket} alt="Rocket" className="w-full h-auto rounded-lg" />
          </div>
        </div>

      
      {/* Services Offering Section */}
      <Services />
        </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
