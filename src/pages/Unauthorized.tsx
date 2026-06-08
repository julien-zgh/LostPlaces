import { Shield, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto border-border/50 shadow-lg">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-destructive/10 border border-destructive/20">
              <Shield className="h-12 w-12 text-destructive" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-foreground">
              Access Denied
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              You don't have permission to access this page. Please contact your
              administrator if you believe this is an error.
            </p>
            <p className="text-red-400 leading-relaxed">
              PS: If you are a user trying to access submit page, please login
              as an explorer then access the submit page.
            </p>
          </div>

          <div className="pt-4 space-y-3">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>

            <Button
              onClick={() => navigate("/")}
              className="w-full bg-terracotta hover:bg-terracotta/90 text-white"
            >
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Button>
          </div>

          <div className="pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Need help?{" "} {" "}
              <a href="mailto:info@lostplaces.com" className="text-[#CF7F4A] hover:underline">
                Contact our support team
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
