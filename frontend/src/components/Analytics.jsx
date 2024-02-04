import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import HeaderOne from "./HeaderOne";
import Footer from "./Footer";
import { useAuthStore } from "../store/store";
import { getAnalytics } from "../helper/helper";
import Upload from "../assets/upload.png";


const Analytics = () => {

  const [analytics, setAnalytics] = useState(null);

  const { username } = useAuthStore((state) => state.auth);

  useEffect(() => {
    const receiveAnalytics = async () => {
      try {
        const analyticsData = await getAnalytics(username);
        setAnalytics(analyticsData);
      } catch (error) {
        toast.error("Error fetching analytics data.");
      }
    };

    receiveAnalytics();
  }, [username]);

  
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <HeaderOne />
      <section
        className="bg-gradient-to-r from-purple-500 via-blue-400 to-purple-500"
        style={{ padding: "6rem" }}
      >
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="space-y-4 md:space-y-4 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                DASHBOARD
              </h1>
            </div>
            {analytics && (
              <div className="p-8"> 
              <div className="flex flex-col items-center gap-4">
                {/* Uploads Section */}
                <div className="bg-gray-300 border border-black border-2 rounded-lg p-8 w-full">
                  <div className="flex items-center">
                    <img src={Upload} alt="Uploads" className="w-full h-auto rounded-lg" />
                    </div>
                  <div className="text-center mt-4">
                      <p className="text-lg font-medium">Total Uploads: {analytics.uploadedCount}</p>
                  </div>
            
                  {/* Display other analytics data related to uploads */}
            
                </div>
              </div>
            </div>
      )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Analytics;
