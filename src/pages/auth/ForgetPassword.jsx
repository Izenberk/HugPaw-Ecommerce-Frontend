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

const ForgotPassword = () => {
  const methods = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Forgot password email:", data);
  };

  return (
    <div className="max-w-sm mx-auto my-15 p-6 border rounded-lg shadow">
      <h2 className="text-2xl font-bold m-2 text-center">Forgot Password</h2>
      <p className="text-sm text-gray-600 text-center m-4">
        Enter your email to receive password reset instructions.
      </p>

      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <FormField
            name="email"
            control={methods.control}
            rules={{
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    placeholder="Enter your email"
                    className="w-full border rounded-full p-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-full"
          >
            Send Reset Link
          </button>
        </form>
      </Form>

      {/* Back to Login */}
      <div className="text-sm text-center mt-4">
        <a href="/login" className="text-blue-500 hover:underline">
          Back to Login
        </a>
      </div>
    </div>
  );
};

export default ForgotPassword;
