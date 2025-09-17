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
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const methods = useForm({
    defaultValues: {
      password: "",
      newpassword: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Please fill your new password:", data);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-sm mx-auto my-15 p-6 border rounded-lg shadow">
        <h2 className="text-2xl font-bold m-2 text-center">Reset Password</h2>
        <p className="text-sm text-gray-600 text-center m-4">
          Enter your new password.
        </p>

        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            {/* Old Password */}
            <FormField
              name="New Password"
              control={methods.control}
              rules={{
                required: "New Password is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid password format",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      placeholder="Enter your new password"
                      className="w-full border rounded-full p-2"
                    />
                  </FormControl>
                  <FormMessage />
                  <FormLabel>Password Confirmation</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      placeholder="Enter your new password"
                      className="w-full border rounded-full p-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-full"
            >
              <Link to="/verificationform">Send Reset Link</Link>
            </button>
          </form>
        </Form>

        <div className="text-sm text-center mt-4">
          <Link to="/login" className="text-blue-500 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
