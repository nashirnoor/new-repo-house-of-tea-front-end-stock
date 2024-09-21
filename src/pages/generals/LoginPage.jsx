import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/features/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RotateCcw } from "lucide-react";

const LoginSchema = Yup.object().shape({
  username: Yup.string().trim().required("Username is required"),
  password: Yup.string().trim().required("Password is required"),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/store");
    } else if (user?.role === "branch_manager") {
      navigate("/branch");
    }
  }, [user, navigate]);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(loginUser(values)).unwrap();
        // Navigation will be handled by the useEffect hook
      } catch (error) {
        console.error("Login failed:", error);
        // Error handling is managed by the Redux state
      }
    },
  });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  {...formik.getFieldProps("username")}
                />
                {formik.touched.username && formik.errors.username && (
                  <p className="text-sm text-red-500">
                    {formik.errors.username}
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...formik.getFieldProps("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="text-sm text-red-500">
                    {formik.errors.password}
                  </p>
                )}
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button className="w-full mt-4" type="submit" disabled={isLoading}>
              {isLoading && <RotateCcw className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
