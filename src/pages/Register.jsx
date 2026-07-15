import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/api/api";
import { useNavigate } from "react-router";
import { Routes } from "@/routes/routes";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { registerSchema } from "@/zod/schemas";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState({
    guestLogin: false,
    register: false,
  });

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleGuestLogin = async () => {
    try {
      setLoading({ guestLogin: true, register: false });

      const response = await axios.post(
        import.meta.env.VITE_BASE_URL + api.GuestLogin,
      );

      const { token } = response.data;

      localStorage.setItem("token", token);

      navigate(Routes.Home);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading({ guestLogin: false, register: false });
    }
  };

  const handleRegister = async () => {
    const result = registerSchema.safeParse(userDetails);
    if (!result.success) {
      const newErrors = { name: "", email: "", password: "" };
      result.error.issues.forEach((issue) => {
        const path = issue.path[0];
        if (path) {
          newErrors[path] = issue.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    try {
      setLoading({ guestLogin: false, register: true });
      const response = await axios.post(
        import.meta.env.VITE_BASE_URL + api.Register,
        {
          ...userDetails,
          guest: false,
        },
      );

      const { token } = response.data;

      localStorage.setItem("token", token);

      navigate(Routes.Home);
    } catch (err) {
      toast.error(err.response?.data?.message|| err.message, {
        position: "bottom-center",
      });
    } finally {
      setLoading({ guestLogin: false, register: false });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create Account</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter your name"
              value={userDetails.name}
              onChange={handleChange}
              className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm font-medium text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={userDetails.email}
              onChange={handleChange}
              className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm font-medium text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Create a strong password"
              value={userDetails.password}
              onChange={handleChange}
              className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
            />

            {errors.password ? (
              <p className="text-sm font-medium text-red-500">{errors.password}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Minimum 8 characters with uppercase, lowercase, number and symbol.
              </p>
            )}
          </div>

          <Button
            className="w-full"
            variant="secondary"
            onClick={handleGuestLogin}
            disabled={loading.guestLogin}
          >
            {loading.guestLogin ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Continue As Guest"
            )}
          </Button>

          <Button
            className="w-full"
            onClick={handleRegister}
            disabled={loading.register}
          >
            {loading.register ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Register"
            )}
          </Button>
          <p className="text-sm">
            Already have a account ?{" "}
            <span
              className="font-bold text-blue-600 cursor-pointer"
              onClick={() => navigate(Routes.Login)}
            >
              Login
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
