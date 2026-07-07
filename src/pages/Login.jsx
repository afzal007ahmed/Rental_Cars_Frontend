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

export default function Login() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await axios.post(
        import.meta.env.VITE_BASE_URL + api.Login,
        userDetails,
      );
      const { token } = data.data;
      localStorage.setItem("token", token);
      setLoading(false);
      nav(Routes.Home);
    } finally {
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
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={userDetails.email}
                onChange={handleChange}
              />
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
              />
            </div>

            <Button type="submit" className="w-full">
              {!loading ? "Login" : <Loader2 className="animate-spin" />}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
