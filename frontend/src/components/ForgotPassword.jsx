import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from "../store/store";
import { generateOTP, verifyOTP } from "../helper/helper";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const ForgotPassword = () => {
  const { setEnteredUsername } = useAuthStore((state) => state);
  const [enteredUsername, setEnteredUsernameLocal] = useState("");

  const [OTP, setOTP] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    if (enteredUsername) {
      generateOTP(enteredUsername).then((OTP) => {
        if (OTP) return toast.success("OTP has been sent to your email!");
        return toast.error("Problem while generating OTP!");
      });
    }
  }, [enteredUsername]);

  async function onSubmit(e) {
    e.preventDefault();

    try {
      if (enteredUsername && OTP && OTP.length === 6) {
        let { status } = await verifyOTP({
          username: enteredUsername,
          code: OTP,
        });
        if (status === 201) {
          toast.success("Verified OTP Successfully!");
          return navigate("/changepassword");
        }
      } else {
        toast.error("Please enter a valid username and OTP!");
      }
    } catch (error) {
      return toast.error("OTP is incorrect!");
    }
  }

  // handler of resend OTP
  function resendOTP() {
    if (enteredUsername) {
      let sentPromise = generateOTP(enteredUsername);
      toast.promise(sentPromise, {
        loading: "Sending...",
        success: <b>OTP has been sent to your email!</b>,
        error: <b>Could not send OTP!</b>,
      });
    } else {
      toast.error("Please enter a username first!");
    }
  }

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <Header />
      <section
        className="bg-gradient-to-r from-purple-500 via-blue-400 to-purple-500"
        style={{ padding: "1.5rem" }}
      >
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
            <h1 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Forgot your password?
            </h1>
            <p className="font-light text-gray-500 dark:text-gray-400">
              Don't worry, it happens to the best of us. Enter username to
              recover password.
            </p>
            <form
              className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
              onSubmit={onSubmit}
            >
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="enter username"
                  required
                  pattern="[a-zA-Z0-9]{8,12}"
                  title="Alphanumeric, 8-12 characters"
                  onChange={(e) => {
                    const { value } = e.target;
                    if (value.length >= 9 && value.length <= 12) {
                        setEnteredUsernameLocal(value);
                        setEnteredUsername(value);
                    } else {
                        // Clear OTP input if username length is invalid
                        setEnteredUsernameLocal("");
                        setEnteredUsername("");
                        setOTP("");
                    }
                }}
                
                />
              </div>
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
