import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Fingerprint } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const methods = useForm({
    defaultValues: { username: "", password: "" },
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log("Login data:", data); // mock login
    login();
    navigate("/");
  };

  return (
    <div className="max-w-sm mx-auto my-10 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 flex justify-center items-center gap-2 py-3">
        Login to HugPaw
      </h2>

      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="username"
            control={methods.control}
            rules={{ required: "Username or email is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username / Email</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    placeholder="Enter your username or email"
                    className="w-full border rounded-full p-2 text-center"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="password"
            control={methods.control}
            rules={{ required: "Password is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <input
                    type="password"
                    {...field}
                    placeholder="Enter your password"
                    className="w-full border rounded-full text-center p-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-sm text-right">
            <Link
              to="/forgotpassword"
              className="text-blue-500 text-[16px] font-semibold hover:underline flex justify-end mx-5"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-full active:scale-95 active:bg-blue-600 transition transform"
          >
            Login
          </button>


            <GoogleOAuthProvider
              clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
            >
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  console.log(credentialResponse);
                  login();
                  navigate("/");
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
              />
            </GoogleOAuthProvider>
        </form>
      </Form>
    </div>
  );
};

export default Login;
