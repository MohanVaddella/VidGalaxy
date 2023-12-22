import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import ChangePassword from "./ChangePassword";
import VideoUpload from "./VideoUpload";
import Hemanth from "./Hemanth";
import TheaterModel from "./TheaterModel";
import NotFound from "./NotFound";
import Home from "./Home";

// Use the Register component in your application
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/videoupload" element={<VideoUpload />} />
        <Route path="/hemanth" element={<Hemanth />} />
        <Route path="/theatermodel" element={<TheaterModel />} />
        <Route path="*" element={<NotFound />} />

        {/* Add other components based on the route */}
      </Routes>
    </div>
  );
}

export default App;
