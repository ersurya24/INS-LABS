import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      role: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await register(formData);
      if (result.user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/telecaller");
      }
    } catch (err) {
      toast.error(
        Array.isArray(err.errors)
          ? err.errors.map((e) => e.msg)
          : err.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">CRM SIGN UP</CardTitle>
        </CardHeader>{" "}
        <p className="text-center text-md -mt-5 font-light">
          CHOOSE YOUR ROLE BELOW
        </p>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder=" ENTER YOUR NAME"
              />
            </div>

            <div>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder=" ENTER YOUR EMAIL"
              />
            </div>

            <div className="flex gap-2">
              <div>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="SELECT ROLE" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="telecaller">TELECALLER</SelectItem>
                    <SelectItem value="admin">ADMIN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder=" ENTER YOUR PASSWORD"
              />
            </div>

            {/* <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex-col gap-4 w-full flex items-center justify-center">
                  <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
                    <div className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"></div>
                  </div>
                </div>
              ) : (
                "REGISTER"
              )}
            </Button> */}
            <Button
              type="submit"
              className="w-full bg-indigo-700 hover:bg-indigo-600 text-white font-semibold py-2 rounded-xl tracking-wide transition"
              disabled={loading}
            >
              {loading ? (
                <div className="flex justify-center items-center">
                  <div className="w-5 h-5 border-2 border-t-white border-white/40 rounded-full animate-spin"></div>
                </div>
              ) : (
                "Register"
              )}
            </Button>

            <p className="text-sm text-center mt-2">
              Already have an account?{" "}
              <RouterLink to="/login" className="underline font-medium">
                Sign In
              </RouterLink>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
