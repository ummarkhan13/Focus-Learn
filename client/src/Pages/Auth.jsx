import React, { useState } from "react";
import { applogo } from "../Constants";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../Api";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true); 
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const userData = { email, password };
    const result = await loginUser(userData);
    if (result) {
      navigate("/");
      console.log(result);
    }else{
      alert("please signup or enter correct details")
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const userData = { username, email, password };
    const result = await registerUser(userData);
    console.log(result);
    if (result) {
      setIsLogin(!isLogin)
    }else{
      alert("something went wrong!")
    }
    console.log(result);
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img className="w-8 h-8 mr-2" src={applogo} alt="logo" />
          FocusLearn
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              {isLogin ? "Sign in to your account" : "Create an account"}
            </h1>

     
            <form
              onSubmit={(e) => (isLogin ? handleLoginSubmit(e) : handleRegisterSubmit(e))}
              className="space-y-4 md:space-y-6"
            >
              {!isLogin && (
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Username
                  </label>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    placeholder="Enter username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              )}

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Your email
                </label>
                <input
                  type="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  placeholder="abc@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                {isLogin ? "Sign in" : "Create an account"}
              </button>

              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
                <span
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500 cursor-pointer"
                >
                  {isLogin ? "Sign up here" : "Login here"}
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Auth;
