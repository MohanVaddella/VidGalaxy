import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Gradient Background */}
      <div className="flex-1 bg-gradient-to-r from-purple-500 via-blue-400 to-purple-500">
        {/* Content of your home page goes here */}
        <div className="container mx-auto py-16">
          <h1 className="text-4xl font-bold text-white">
            Welcome to My Website
          </h1>
          <p className="text-lg text-white mt-4">
            Explore the amazing content and features we offer!
          </p>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
