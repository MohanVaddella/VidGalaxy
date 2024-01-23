import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Header from "./Header";
import Footer from "./Footer";
import { useAuthStore } from "../store/store";
import { getAnalytics } from "../helper/helper";
import { FaVideo, FaChartPie } from "react-icons/fa";


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
      <Header />
      <section
        className="bg-gradient-to-r from-purple-500 via-blue-400 to-purple-500"
      >
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full max-w-screen-xl mx-auto bg-white rounded-lg shadow dark:border md:mt-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                DASHBOARD
              </h1>
            </div>
            {analytics && (
              <div className="p-8">
        <div className="grid grid-cols-2 gap-8">
           {/* Uploads Section */}
            <div className="bg-gray-300 border border-black border-2 rounded-lg p-8">
                  <div className="flex items-center">
                    <FaVideo className="text-2xl text-blue-500 mr-2" />
                    <p className="text-lg font-medium">Total Uploads: {analytics.uploadedCount}</p>
                  </div>
                  {/* Display other analytics data related to uploads */}
                </div>

                {/* Categories Section */}
                <div className="bg-gray-300 border border-black border-2 rounded-lg p-8">
                  <div className="flex items-center">
                    <FaChartPie className="text-2xl text-green-500 mr-2" />
                    <p className="text-lg font-medium">Category-wise Distribution</p>
                  </div>
                  {/* Display pie chart or other visual representation for category-wise distribution */}
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
