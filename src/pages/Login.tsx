import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
//Zustand store to save user data
import { useUserStore } from "@/lib/zustand/UserStore";

export const Login = () => {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);
  useEffect(() => {
    if (user) {
      if (user.role === "explorer") {
        navigate("/dashboard");
      } else if (user.role === "user") {
        navigate("/profile");
      } else {
        navigate("/admin");
      }
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Login request
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important to include cookies/session
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || data.message || "Login failed");
        setIsLoading(false);
        return;
      } else {
        if (data.twoFA) {
          // 2FA is enabled → go to verify page
          toast.info("Please verify your 2FA code.");
          navigate("/verify");
          return;
        }
        
        localStorage.setItem("loggedIn", "true");
        // After successful login, fetch user profile
        const profileRes = await fetch("http://localhost:3000/api/profile", {
          credentials: "include",
        });
        if (!profileRes.ok) {
          toast.error("Failed to fetch profile");
          setIsLoading(false);
          return;
        }
        const profileData = await profileRes.json();
        // Store user in Zustand
        // console.log("profileData", profileData);
        setUser(profileData.user);
      }

      toast.success("Logged in Successfully. Redirecting...");
    } catch (error) {
      toast.error("Error logging in: " + error.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-background to-stone/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-terracotta rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-serif font-semibold text-foreground">
              LostPlaces
            </span>
          </Link>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-serif">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your account to explore and contribute to world's
              heritage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    placeholder="••••••••"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex justify-center">
                <Link
                  to="/forgot-password"
                  className="text-sm text-terracotta hover:text-terracotta/80"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-terracotta hover:bg-terracotta/90"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <Separator className="my-6" />

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-terracotta hover:text-terracotta/80 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="text-center mt-8 space-x-4 text-sm text-muted-foreground">
          <Link to="/privacy" className="hover:text-terracotta">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link to="/terms" className="hover:text-terracotta">
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
};
