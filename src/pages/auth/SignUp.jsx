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

const Signup = () => {
  const methods = useForm({
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      Date: "",
      phonenumber: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
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
              <FormLabel>First name</FormLabel>
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
              <FormLabel>Last name</FormLabel>
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

        <FormField
          name="date"
          control={methods.control}
          rules={{ required: "Date is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
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
              <FormLabel>Phone number</FormLabel>
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

        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="username"
            control={methods.control}
            rules={{ required: "Username is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
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
                <FormLabel>Password</FormLabel>
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
                <FormLabel>Confirm Password</FormLabel>
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
