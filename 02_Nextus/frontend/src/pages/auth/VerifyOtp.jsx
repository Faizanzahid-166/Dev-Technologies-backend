// src/pages/auth/VerifyOtpPage.jsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router";
import {
  verifyOtpThunk,
  resendOtpThunk,
} from "../../redux/authSliceTunk/authTunk.js";
import { clearAuthState } from "../../redux/authSliceTunk/authSlice.js";

function VerifyOtpPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, message } = useSelector((state) => state.auth);

  // Get email from navigation state passed from signup
  const fixedEmail = location.state?.email;

  // Redirect back to signup/login if no email is found
  useEffect(() => {
    if (!fixedEmail) navigate("/signup");
  }, [fixedEmail, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Handle OTP verification
  const onSubmit = (data) => {
    dispatch(verifyOtpThunk({ email: fixedEmail, otp: data.otp }))
      .unwrap()
      .then((res) => {
        if (res?.data?.user) navigate("/login"); // redirect after verification
      })
      .catch((err) => console.log("OTP verification failed", err));
  };

  // Handle OTP resend
  const handleResendOtp = () => {
    if (!fixedEmail) return alert("Email not found");

    dispatch(resendOtpThunk({ email: fixedEmail }))
      .unwrap()
      .then((res) => alert(res.message || "OTP resent successfully"))
      .catch((err) => alert(err || "Failed to resend OTP"));
  };

  // Clear auth messages on unmount
  useEffect(() => {
    return () => dispatch(clearAuthState());
  }, [dispatch]);

  const renderMessage = (msg) => {
    if (!msg) return null;
    return typeof msg === "string" ? msg : JSON.stringify(msg);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Verify OTP</h2>

        {error && <p className="text-red-500 mb-2">{renderMessage(error)}</p>}
        {message && <p className="text-green-500 mb-2">{renderMessage(message)}</p>}

        <p className="mb-4 text-sm text-gray-700 text-center">
          OTP sent to <strong>{fixedEmail}</strong>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* OTP input */}
          <div>
            <label className="block text-sm font-medium mb-1">OTP</label>
            <input
              type="text"
              {...register("otp", { required: "OTP is required" })}
              placeholder="Enter OTP"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
            {errors.otp && (
              <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* Resend OTP */}
        <div className="mt-4 text-center">
          <button
            onClick={handleResendOtp}
            className="text-blue-500 hover:underline"
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtpPage;
