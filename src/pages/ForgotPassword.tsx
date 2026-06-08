import { useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, Mail, ArrowLeft, CheckCircle } from "lucide-react";
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
import { toast } from "sonner";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await fetch(`http://localhost:3000/api/auth/forgot-password/${email}`);
    
    if (!res.ok) {
      toast.error("Failed to send password reset email. Please try again.");
      setIsLoading(false);
      return;
    }    

    setIsEmailSent(true);
    toast.success("Password reset email sent successfully!");
    setIsLoading(false);
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-background to-stone/20 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2">
              <div className="w-10 h-10 bg-terracotta rounded-lg flex items-center justify-center">
                <KeyRound className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-serif font-semibold text-foreground">
                LostPlaces
              </span>
            </Link>
          </div>

          {/* Success Card */}
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-serif">
                Check Your Email
              </CardTitle>
              <CardDescription>
                We've sent password reset instructions to{" "}
                <span className="font-medium text-foreground">{email}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-stone/10 border border-stone/20 rounded-lg p-4">
                <h3 className="font-medium text-sm mb-2">Next steps:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>1. Check your email inbox (and spam folder)</li>
                  <li>2. Click the reset link in the email</li>
                  <li>3. Create a new password</li>
                  <li>4. Sign in with your new password</li>
                </ul>
              </div>

              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the email?
                </p>
                <Button
                  onClick={handleSubmit}
                  variant="outline"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Resending..." : "Resend Email"}
                </Button>
              </div>

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm text-terracotta hover:text-terracotta/80"
                >
                  Back to Sign In
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-background to-stone/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-terracotta rounded-lg flex items-center justify-center">
              <KeyRound className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-serif font-semibold text-foreground">
              LostPlaces
            </span>
          </Link>
        </div>

        {/* Back Link */}
        <Link
          to="/login"
          className="inline-flex items-center text-terracotta hover:text-terracotta/80 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sign In
        </Link>

        {/* Forgot Password Card */}
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-serif">
              Reset Your Password
            </CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your
              password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-terracotta hover:bg-terracotta/90"
                disabled={isLoading}
              >
                {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="text-terracotta hover:text-terracotta/80 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Help */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Still having trouble? Contact us at{" "}
            <a
              href="mailto:support@lostplaces.com"
              className="text-terracotta hover:text-terracotta/80"
            >
              support@lostplaces.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
