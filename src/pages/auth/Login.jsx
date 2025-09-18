import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useUser } from "@/context/UserContext.jsx";
// import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"; เก็บไว้ทำในอนาคต

const schema = z.object({
  email: z.string().email("Not valid email"),
  password: z.string().min(6, "Password must more than 6 character"),
});

const Login = () => {
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const { login, user } = useAuth();
  const { refreshUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const onSubmit = async (values) => {
    const result = await login(values.email, values.password);

    if (!result.success) {
      methods.setError("root", { message: result.message });
      return;
    }

    await refreshUser();

    let role = result.user?.role;

    if (!role) {
      try {
        const me = await fetch(
          (import.meta.env.VITE_API_BASE ?? "http://localhost:3030/api/v1") +
            "/auth/me",
          { credentials: "include" }
        ).then((r) => r.json());
        role = me?.user?.role;
      } catch {}
    }

    const r = String(role || "user").toLowerCase();

    if (r === "admin") {
      navigate("/admin", { replace: true });
    } else {
      navigate(from || "/", { replace: true });
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-sm mx-auto my-10 p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4 flex justify-center items-center gap-2 py-3">
          Login to HugPaw
        </h2>

      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="email"
            control={methods.control}
            rules={{ required: "Email is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    type="email"
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

          {methods.formState.errors.root && (
            <p>{methods.formState.errors.root.message}</p>
          )}

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
            disabled={methods.formState.isSubmitting}
            className="w-full bg-blue-700 text-white py-2 rounded-full active:scale-95 active:bg-blue-600 transition transform"
          >
            {methods.formState.isSubmitting ? "Signing in..." : "Login"}
          </button>

          {/* <GoogleOAuthProvider
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
            </GoogleOAuthProvider> */}
        </form>
      </Form>
    </div>
  );
};

export default Login;
