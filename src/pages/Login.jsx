import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { api } from "@/api/api";
import { useNavigate } from "react-router";
import { Routes } from "@/routes/routes";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { loginSchema } from "@/zod/schemas";

export default function Login() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
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

  const handleSubmit = async (e, type) => {
    e.preventDefault();

    if (type === "user") {
      const result = loginSchema.safeParse(userDetails);
      if (!result.success) {
        const newErrors = { email: "", password: "" };
        result.error.issues.forEach((issue) => {
          const path = issue.path[0];
          if (path) {
            newErrors[path] = issue.message;
          }
        });
        setErrors(newErrors);
        return;
      }
    }

    try {
      setLoading(true);
      const data = await axios.post(
        type === "guest"
          ? import.meta.env.VITE_BASE_URL + api.GuestLogin
          : import.meta.env.VITE_BASE_URL + api.Login,
        userDetails,
      );
      const { token } = data.data;
      localStorage.setItem("token", token);
      setLoading(false);
      nav(Routes.Home);
    }
    catch(err){
      toast.error(err.response.data.message || err.message , { position : "bottom-center"})
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Login</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={(e) => handleSubmit(e, "user")} className="space-y-5">
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
                placeholder="Enter your password"
                value={userDetails.password}
                onChange={handleChange}
                className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.password && (
                <p className="text-sm font-medium text-red-500">{errors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full">
              {!loading ? "Login" : <Loader2 className="animate-spin" />}
            </Button>
            <Button
              className="w-full"
              onClick={(e) => handleSubmit(e, "guest")}
            >
              Continue As Guest
            </Button>
          </form>
          <p className="text-sm mt-2">
            Don't have a account ?{" "}
            <span
              className="font-bold text-blue-600 cursor-pointer"
              onClick={() => nav(Routes.Register)}
            >
              Register
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
