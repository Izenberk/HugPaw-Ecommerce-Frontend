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
import { Button } from "@/components/ui/button";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Fingerprint } from "lucide-react";

const Login = () => {
  const methods = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Login data:", data);
  };

  //clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
  const googleAuth = () => {
    <GoogleOAuthProvider>
      <div className="flex justify-center items-center h-screen">
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            console.log(credentialResponse);
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </div>
    </GoogleOAuthProvider>;
  };

  return (
    <div className="max-w-sm mx-auto my-10 p-6 rounded-xl shadow-md ">
      <h2 className="text-2xl font-bold mb-4 flex justify-around py-3">
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
            <a
              href="/forgotpassword"
              className="text-blue-500 text-[16px] font-semibold hover:underline flex justify-end mx-5"
            >
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded active:scale-95 active:bg-blue-600 transition transform"
          >
            Login
          </Button>

          <Button
            type="button"
            onClick={googleAuth}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded active:scale-95 active:bg-blue-600 transition transform"
          >
            <Fingerprint /> Login with Google
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Login;
