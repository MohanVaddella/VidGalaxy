import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Header from "./Header";
import Footer from "./Footer";
import { useAuthStore } from "../store/store";
import { getAnalytics } from "../helper/helper";


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
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Your Monthly Analytics
              </h1>
            </div>
            {analytics && (
        <div>
          <p>Total Uploaded Videos: {analytics.uploadedCount}</p>
          {/* Display other analytics data as needed */}
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
