import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from "../store/store";
import { generateOTP, verifyOTP } from "../helper/helper";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const ForgotPassword = () => {
  const { username } = useAuthStore((state) => state.auth);
  const [OTP, setOTP] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    generateOTP(username).then((OTP) => {
      if (OTP) return toast.success("OTP has been sent to your email!");
      return toast.error("Problem while generating OTP!");
    });
  }, [username]);

  async function onSubmit(e) {
    e.preventDefault();

    try {
      let { status } = await verifyOTP({ username, code: OTP });
      if (status === 201) {
        toast.success("Verified OTP Successfully!");
        return navigate("/changepassword");
      }
    } catch (error) {
      return toast.error("OTP is incorrect!");
    }
  }

  // handler of resend OTP
  function resendOTP() {
    let sentPromise = generateOTP(username);
    toast.promise(sentPromise, {
      loading: "Sending...",
      success: <b>OTP has been send to your email!</b>,
      error: <b>Could not send OTP!</b>,
    });

    sentPromise.then((OTP) => {
      //console.log(OTP);
    });
  }

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <Header />
      <section className="bg-gradient-to-r from-purple-500 via-blue-400 to-purple-500">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
            <h1 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Forgot your password?
            </h1>
            <p className="font-light text-gray-500 dark:text-gray-400">
              Don't worry, it happens to the best of us. Enter OTP to recover
              password.
            </p>
            <form
              className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
              onSubmit={onSubmit}
            >
              <div>
                <label
                  htmlFor="otp"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Enter OTP
                </label>
                <input
                  type="text"
                  name="otp"
                  id="otp"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Your 6 digit OTP"
                  required
                  maxLength="6"
                  pattern="[0-9]{6}"
                  title="Enter a 6-digit OTP"
                  onChange={(e) => setOTP(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Recover
              </button>
            </form>
            <div className="text-center py-4">
              <span className="text-gray-500">
                Can't get OTP?{" "}
                <button onClick={resendOTP} className="text-purple-500">
                  Resend
                </button>
              </span>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
