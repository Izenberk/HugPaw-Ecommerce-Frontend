import React from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const GoogleButton = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log(tokenResponse);
      login();
      navigate("/");
    },
    onError: () => {
      console.log("Login Failed");
    },
  });

  return (
      <button
        onClick={() => googleLogin()}
        className="w-full bg-blue-700 text-white py-2 px-4 rounded-full flex items-center justify-center gap-2 active:scale-95 active:bg-blue-600 transition transform"
      >
        Login with Google
      </button>
  );
};

export default GoogleButton;
