// src/pages/Login.jsx
import { useForm } from "react-hook-form";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";

import { loginUser } from "../store/actions/userActions";

export default function Login() {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const status = useSelector((s) => s.user?.status) || "idle";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: { email: "", password: "", remember: false },
  });

  const onSubmit = (values) => {
    const { email, password, remember } = values;

    return dispatch(loginUser({ email, password, rememberMe: remember }))
      .then(() => {
        const from = location.state?.from?.pathname || "/";
        if (from) {
          history.replace(from);
          return;
        }

        if (history.length > 1) history.goBack();
        else history.push("/");
      })
      .catch((msg) => {
        toast.error(msg || "Login failed");
      });
  };

  return (
    <main className="w-[95%] md:w-[60%] lg:w-[35%] mx-auto my-16 p-8 bg-white shadow-xl rounded-2xl font-[Montserrat] text-gray-800">
      {/* Başlık */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Welcome Back
        </h1>
        <p className="mt-2 text-gray-600">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline font-semibold">
            Register
          </Link>
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 text-base">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block font-medium text-gray-700 mb-1">
            Email*
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
            className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 rounded-lg outline-none"
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block font-medium text-gray-700 mb-1">
            Password*
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register("password", {
              required: "Password is required",
            })}
            className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 rounded-lg outline-none"
          />
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        {/* Remember me */}
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" {...register("remember")} className="w-4 h-4" />
          <span>Remember me</span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || status === "loading"}
          className="mt-4 bg-blue-500 text-white font-semibold py-3 rounded-lg w-full flex justify-center items-center hover:bg-blue-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting || status === "loading" ? (
            <CircularProgress size={24} className="text-white" />
          ) : (
            "Login"
          )}
        </button>
      </form>
    </main>
  );
}
