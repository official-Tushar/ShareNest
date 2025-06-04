import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import loginImage from "../assets/images/login.png";

const Login = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          emailId,
          password,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      console.log(res);
      toast.success(
        `Logged in as ${res?.data?.data?.firstName} ${res?.data?.data?.lastName}`
      );

      return navigate("/");
    } catch (err) {
      setError(err.response.data || "Something went wrong");
      toast.error("Login failed. Please try again.");
    }
  };

  const handleSignUp = async () => {
    try {
      await axios.post(
        BASE_URL + "/signup",
        {
          firstName,
          lastName,
          emailId,
          password,
        },
        { withCredentials: true }
      );

      const fullRes = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });

      dispatch(addUser(fullRes.data));
      toast.success("Account created successfully");

      return navigate("/profile");
    } catch (err) {
      setError(err.response.data || "Something went wrong");
      toast.error("Sign Up failed. Please try again.");
    }
  };

  return (
    <div className="md:flex xl:ml-20 xl:mr-15 lg:ml-10 lg:mr-7 md:ml-5 md:mr-2 items-center">
      <div className="w-full sm:w-3/4 mx-auto md:w-1/2 md:mt-30 mt-20">
        <img src={loginImage} alt="login-logout" className="w-7/8 mx-auto" />
      </div>
      <div className="w-full sm:w-3/4 mx-auto md:w-1/2 md:mt-30 mb-8">
        <div className="card card-border bg-base-300 w-3/4 sm:px-5 px-2 mx-auto">
          <div className="card-body">
            <h2 className="card-title justify-center text-xl sm:text-2xl font-bold">
              {isLoginForm ? "Sign In" : "Sign Up"}
            </h2>

            {!isLoginForm && (
              <>
                <fieldset className="fieldset my-1">
                  <legend className="fieldset-legend text-sm xs:text-[16px] sm:text-lg">
                    First Name
                  </legend>
                  <input
                    type="text"
                    value={firstName}
                    className="input w-full pr-10"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </fieldset>

                <fieldset className="fieldset my-1">
                  <legend className="fieldset-legend text-sm xs:text-[16px] sm:text-lg">
                    Last Name
                  </legend>
                  <input
                    type="text"
                    value={lastName}
                    className="input w-full pr-10"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </fieldset>
              </>
            )}

            <fieldset className="fieldset my-1">
              <legend className="fieldset-legend text-sm xs:text-[16px] sm:text-lg">
                E-mail ID
              </legend>
              <input
                type="text"
                value={emailId}
                className="input w-full pr-10"
                onChange={(e) => setEmailId(e.target.value)}
              />
            </fieldset>

            <fieldset className="fieldset my-1">
              <legend className="fieldset-legend text-sm xs:text-[16px] sm:text-lg">
                Password
              </legend>

              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input w-full pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 -translate-y-1/2 right-3 text-amber-700 cursor-pointer"
                >
                  {showPassword ? (
                    <Eye size={20} className="w-4" />
                  ) : (
                    <EyeOff size={20} className="w-4" />
                  )}
                </button>
              </div>
            </fieldset>

            <p className="text-red-500 text-xs sm:text-sm">{error}</p>
            <div className="card-actions justify-center">
              <button
                className="btn btn-primary h-fit py-1 sm:py-2 text-xs md:text-sm"
                onClick={isLoginForm ? handleLogin : handleSignUp}
              >
                {isLoginForm ? "Login" : "Sign Up"}
              </button>
            </div>

            <p
              className="text-white cursor-pointer mt-1 sm:text-sm text-xs"
              onClick={() => setIsLoginForm(!isLoginForm)}
            >
              {isLoginForm ? "New User? Sign Up here" : "Already a User? Login"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
