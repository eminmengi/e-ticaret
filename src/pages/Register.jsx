import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";

import { useDispatch, useSelector } from "react-redux";
import { fetchRolesIfNeeded } from "../store/thunks/clientThunks";

export default function Register() {
  const history = useHistory();
  const dispatch = useDispatch();
  const roles = useSelector((s) => s.client.roles);

  const storeRoleId = roles.find((r) => r.code === "store")?.id ?? null;
  const customerRoleId = roles.find((r) => r.code === "customer")?.id ?? null;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      role_id: "",
    },
  });

  const selectedRole = watch("role_id");

  useEffect(() => {
    dispatch(fetchRolesIfNeeded());
  }, [dispatch]);

  useEffect(() => {
    if (!watch("role_id") && customerRoleId) {
      setValue("role_id", String(customerRoleId));
    }
  }, [customerRoleId, setValue, watch]);

  const onSubmit = async (data) => {
    if (data.password !== data.passwordConfirm) {
      toast.error("Passwords do not match!");
      return;
    }

    const roleIdNum = Number(data.role_id);

    let payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      role_id: roleIdNum,
    };

    if (roleIdNum === storeRoleId) {
      payload.store = {
        name: data.store_name,
        phone: data.store_phone,
        tax_no: data.tax_no,
        bank_account: data.bank_account,
      };
    }

    try {
      await axiosInstance.post("/signup", payload);
      reset();
      toast.success("Check your email to activate your account!");
      history.goBack();
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <main className="w-[95%] md:w-[60%] lg:w-[40%] mx-auto my-16 p-8 bg-white shadow-xl rounded-2xl font-[Montserrat] text-gray-800">
      {/* Başlık */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Create an Account
        </h1>
        <p className="mt-2 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline font-semibold">
            Log in
          </Link>
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 text-base">
        {/* Full Name */}
        <div>
          <label htmlFor="name" className="block font-medium text-gray-700 mb-1">
            Full Name*
          </label>
          <input
            id="name"
            placeholder="Enter your full name"
            {...register("name", {
              required: "Name is required",
              minLength: { value: 3, message: "At least 3 characters" },
            })}
            className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 rounded-lg outline-none"
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block font-medium text-gray-700 mb-1">
            Email*
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter a valid email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
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
            placeholder="At least 8 characters incl. upper, lower, number, special"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "At least 8 characters" },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
                message: "Must include upper, lower, number, special char",
              },
            })}
            className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 rounded-lg outline-none"
          />
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="passwordConfirm" className="block font-medium text-gray-700 mb-1">
            Confirm Password*
          </label>
          <input
            id="passwordConfirm"
            type="password"
            placeholder="Re-enter your password"
            {...register("passwordConfirm", { required: "Please confirm your password" })}
            className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 rounded-lg outline-none"
          />
          {errors.passwordConfirm && <p className="text-sm text-red-500 mt-1">{errors.passwordConfirm.message}</p>}
        </div>

        {/* Role */}
        <div>
          <label htmlFor="role_id" className="block font-medium text-gray-700 mb-1">
            Role*
          </label>
          <select
            id="role_id"
            {...register("role_id", { required: "Role is required" })}
            className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 rounded-lg outline-none"
          >
            <option value="">Select a role</option>
            {roles.map((role) => (
              <option key={role.id} value={String(role.id)}>
                {role.code === "customer" ? "Customer" : role.code === "store" ? "Store" : "Admin"}
              </option>
            ))}
          </select>
          {errors.role_id && <p className="text-sm text-red-500 mt-1">{errors.role_id.message}</p>}
        </div>

        {/* Store alanları (sadece store seçilirse) */}
        {Number(selectedRole) === storeRoleId && (
          <>
            <div>
              <label htmlFor="store_name" className="block font-medium text-gray-700 mb-1">
                Store Name*
              </label>
              <input
                id="store_name"
                placeholder="Enter store name"
                {...register("store_name", {
                  required: "Store name is required",
                  minLength: { value: 3, message: "At least 3 characters" },
                })}
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 rounded-lg outline-none"
              />
              {errors.store_name && <p className="text-sm text-red-500 mt-1">{errors.store_name.message}</p>}
            </div>

            <div>
              <label htmlFor="store_phone" className="block font-medium text-gray-700 mb-1">
                Store Phone*
              </label>
              <input
                id="store_phone"
                placeholder="+905xxxxxxxxx"
                {...register("store_phone", {
                  required: "Phone is required",
                  pattern: { value: /^\+[1-9]{1}[0-9]{7,11}$/, message: "Invalid mobile number" },
                })}
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 rounded-lg outline-none"
              />
              {errors.store_phone && <p className="text-sm text-red-500 mt-1">{errors.store_phone.message}</p>}
            </div>

            <div>
              <label htmlFor="tax_no" className="block font-medium text-gray-700 mb-1">
                Store Tax ID*
              </label>
              <input
                id="tax_no"
                placeholder="Format: TXXXXVXXXXXX"
                {...register("tax_no", {
                  required: "Tax ID is required",
                  pattern: { value: /^T\d{4}V\d{6}$/, message: "Format TXXXXVXXXXXX" },
                })}
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 rounded-lg outline-none"
              />
              {errors.tax_no && <p className="text-sm text-red-500 mt-1">{errors.tax_no.message}</p>}
            </div>

            <div>
              <label htmlFor="bank_account" className="block font-medium text-gray-700 mb-1">
                Store Bank Account (IBAN)*
              </label>
              <input
                id="bank_account"
                placeholder="TRXXXXXXXXXXXXXXXXXXXXXXXXXX"
                {...register("bank_account", {
                  required: "Bank account is required",
                  pattern: { value: /^TR\d{24}$/, message: "Invalid IBAN" },
                })}
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 rounded-lg outline-none"
              />
              {errors.bank_account && <p className="text-sm text-red-500 mt-1">{errors.bank_account.message}</p>}
            </div>
          </>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 bg-blue-500 text-white font-semibold py-3 rounded-lg w-full flex justify-center items-center hover:bg-blue-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <CircularProgress size={24} className="text-white" /> : "Register"}
        </button>
      </form>
    </main>
  );
}
