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
import { showToast } from "@/lib/toast";

const Signup = () => {
  const methods = useForm({
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      Date: "",
      phonenumber: "",
      address: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data) => {
    if (data.password !== data.confirmPassword) {
      // alert("Passwords do not match");
      showToast(
        "error",
        {
          title: "Passwords do not match",
        },
        { duration: 2000 }
      );
      return;
    }
    console.log("Signup data:", data);
  };

  return (
    <div className="max-w-sm mx-auto my-10 p-6 border rounded-lg shadow">
      <h2 className="text-2xl text-center font-bold mb-4">
        Sign Up for HugPaw
      </h2>

      <Form {...methods}>
        <FormField
          name="firstname"
          control={methods.control}
          rules={{ required: "First name is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="py-1">First name</FormLabel>
              <FormControl>
                <input
                  type="firstname"
                  {...field}
                  placeholder="Enter your First name"
                  className="w-full border rounded-full p-2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="lastname"
          control={methods.control}
          rules={{ required: "Last name is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="py-1">Last name</FormLabel>
              <FormControl>
                <input
                  type="lastname"
                  {...field}
                  placeholder="Enter your Last name"
                  className="w-full border rounded-full p-2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="email"
          control={methods.control}
          rules={{
            required: "Email is required",
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="py-1">Email</FormLabel>
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

        <FormField
          name="date"
          control={methods.control}
          rules={{ required: "Date is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="py-1">Date</FormLabel>
              <FormControl>
                <input
                  type="date"
                  {...field}
                  className="w-full border rounded-full p-2"
                  placeholder="mm/dd/yyyy"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="phonenumber"
          control={methods.control}
          rules={{
            required: "Phone number is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Invalid phone number format",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="py-1">Phone number</FormLabel>
              <FormControl>
                <input
                  type="tel"
                  {...field}
                  className="w-full border rounded-full p-2"
                  placeholder="1234567890"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="address"
          control={methods.control}
          rules={{ required: "Address is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="py-1">Address</FormLabel>
              <FormControl>
                <input
                  type="address"
                  {...field}
                  placeholder="Enter your Address"
                  className="w-full border rounded-full p-2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="username"
            control={methods.control}
            rules={{ required: "Username is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="py-1">Username</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    placeholder="Enter your username"
                    className="w-full border rounded-full p-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            name="password"
            control={methods.control}
            rules={{ required: "Password is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="py-1">Password</FormLabel>
                <FormControl>
                  <input
                    type="password"
                    {...field}
                    placeholder="Enter your password"
                    className="w-full border rounded-full p-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            name="confirmPassword"
            control={methods.control}
            rules={{ required: "Please confirm your password" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="py-1">Confirm Password</FormLabel>
                <FormControl>
                  <input
                    type="password"
                    {...field}
                    placeholder="Confirm your password"
                    className="w-full border rounded-full p-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <button
            type="submit"
            className="w-full rounded-full bg-blue-500 hover:bg-blue-600 text-white py-2 active:scale-95 active:bg-blue-600 transition transform"
          >
            Sign Up
          </button>
        </form>
      </Form>
    </div>
  );
};

export default Signup;
