import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Shield, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/lib/zustand/UserStore";

export const Verify2FA = () => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);
  useEffect(() => {
    if (user) {
      if (user.role === "explorer") {
        navigate("/dashboard");
      } else if (user.role === "user") {
        navigate("/profile");
      }
    }
  }, [user, navigate]);

  const handleVerify = async (code) => {
    setIsVerifying(true);

    try {
      //check if code is 6 digits and is valid
      const res = await fetch("http://localhost:3000/api/auth/validate-2fa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ token: code }),
      });

      if (!res.ok) {
        throw new Error("Verification failed");
      }


      localStorage.setItem("loggedIn", "true");
      // After successful login, fetch user profile
      const profileRes = await fetch("http://localhost:3000/api/profile", {
        credentials: "include",
      });
      if (!profileRes.ok) {
        toast({
          title: "Error",
          description: "Failed to fetch profile",
        });
        return;
      }
      const profileData = await profileRes.json();
      setUser(profileData.user);

      toast({
        title: "Success",
        description: "Two-factor authentication verified successfully.",
      });
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Invalid or expired verification code.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleChange = (value) => {
    setOtp(value);

    // Automatically verify once 6 digits are entered
    if (value.length === 6 && !isVerifying) {
      handleVerify(value);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">
              Two-Factor Authentication
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Enter the 6-digit code from your authenticator app
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <InputOTP maxLength={6} value={otp} onChange={handleChange}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            {/* <p className="text-sm text-muted-foreground text-center">
              The code expires in 30 seconds
            </p> */}
          </div>

          <div className="space-y-3">
            {/* <Button
              variant="outline"
              onClick={handleResend}
              disabled={isVerifying}
              className="w-full"
            >
              Resend Code
            </Button> */}

            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="w-full"
              disabled={isVerifying}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Having trouble? Contact support or try alternative authentication
              methods.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
