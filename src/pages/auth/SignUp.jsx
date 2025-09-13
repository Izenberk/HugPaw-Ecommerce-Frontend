import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const signupSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email format"),
    birthDate: z.string().min(1, "Birthdate is required"),
    phoneNumber: z
      .string()
      .regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),
    address: z.string().min(1, "Address is required"),
    username: z
      .string()
      .min(4, "Username must be at least 4 characters")
      .max(20, "Username must be at most 20 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const Signup = () => {
  const methods = useForm({
    resolver: zodResolver(signupSchema), 
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      birthDate: "",
      phoneNumber: "",
      address: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { signup } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const payload = {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      birthDate: data.birthDate,
      avatarUrl: "",
    };

    const result = await signup(payload);
    if (result.success) {
      navigate("/login");
    } else {
      methods.setError("root", { message: result.message });
    }
  };

  return (
    <div className="max-w-sm mx-auto my-10 p-6 border rounded-lg shadow">
      <h2 className="text-2xl text-center font-bold mb-4">
        Sign Up for HugPaw
      </h2>

      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="firstName"
            control={methods.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    className="w-full border rounded-full p-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="lastName"
            control={methods.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <input
                    {...field}
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    type="email"
                    className="w-full border rounded-full p-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="birthDate"
            control={methods.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Birthdate</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    type="date"
                    className="w-full border rounded-full p-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="phoneNumber"
            control={methods.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    type="tel"
                    placeholder="1234567890"
                    className="w-full border rounded-full p-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="address"
            control={methods.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    className="w-full border rounded-full p-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="username"
            control={methods.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    className="w-full border rounded-full p-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="password"
            control={methods.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    type="password"
                    className="w-full border rounded-full p-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="confirmPassword"
            control={methods.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    type="password"
                    className="w-full border rounded-full p-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {methods.formState.errors.root && (
            <p className="text-red-600 text-sm">
              {methods.formState.errors.root.message}
            </p>
          )}

          <button
            type="submit"
            disabled={methods.formState.isSubmitting}
            className="w-full rounded-full bg-blue-500 hover:bg-blue-600 text-white py-2 transition"
          >
            {methods.formState.isSubmitting ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </Form>
    </div>
  );
};

export default Signup;
