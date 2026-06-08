import { Card, CardContent } from "@/components/ui/card";
import { Lock, LockOpen, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import GeneralModal from "../Modal/GeneralModal";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";

const TwoFactor = ({ isEnabled, id }: { isEnabled: boolean; id: string }) => {
  const [enabled, setEnabled] = useState(isEnabled);

  const [isEnabling, setIsEnabling] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [loadingQrCode, setLoadingQrCode] = useState(false);

  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const handleVerify = async (code) => {
    setIsVerifying(true);

    try {
      const res = await fetch("http://localhost:3000/api/auth/2fa/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: id, token: code }),
      })
      
      if (!res.ok) {
        throw new Error("Verification failed");
      }

      toast({
        title: "Success",
        description: "Two-factor authentication verified successfully.",
      });
      setEnabled(true);
      setIsEnabling(false);
    } catch {
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

  const handleEnable2FA = async () => {
    const res = await fetch(`http://localhost:3000/api/auth/2fa/enable`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: id }),
    });

    if (!res.ok) {
      toast({
        title: "Failed",
        description: "Failed to enable 2FA. Please try again.",
      });
    }

    setEnabled(true);
  };

  return (
    <>
      {/* Two-Factor Authentication */}
      <Card className="mb-8 border-2 border-dashed border-muted-foreground/20 bg-gradient-to-br from-background to-muted/20">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-xl bg-primary/10 ring-2 ring-primary/20">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    Two-Factor Authentication
                  </h3>
                  {enabled ? (
                    <Badge
                      variant="outline"
                      className="text-xs bg-green-600/10 text-green-600"
                    >
                      <Lock className="w-3 h-3 mr-1" />
                      Enabled
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs bg-muted">
                      <LockOpen className="w-3 h-3 mr-1" />
                      Not Enabled
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3 max-w-xl">
                  Add an extra layer of security to your account. When enabled,
                  you'll need to enter a verification code from your phone in
                  addition to your password.
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Enhanced security</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Quick setup</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Protect your data</span>
                  </div>
                </div>
              </div>
            </div>
            {!enabled && (
              <Button
                size="lg"
                className="shrink-0 w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={async () => {
                  setIsEnabling(true);
                  try {
                    setLoadingQrCode(true);
                    const res = await fetch(
                      "http://localhost:3000/api/auth/2fa/generate",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ userId: id }),
                      }
                    );
                    if (!res.ok) {
                      throw new Error("Failed to generate QR code");
                    }
                    const data = await res.json();
                    setQrCode(data.qr);
                  } catch {
                    toast({
                      title: "Error",
                      description: "Failed to load QR Code. Please try again.",
                    });
                    return;
                  } finally {
                    setLoadingQrCode(false);
                  }
                }}
              >
                <Shield className="w-4 h-4 mr-2" />
                Enable 2FA
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <GeneralModal isOpen={isEnabling} onClose={() => setIsEnabling(false)}>
        <div className="p-8">
          {loadingQrCode ? (
            <p>Loading QR Code...</p>
          ) : (
            <div>
              <img src={qrCode} alt="2FA QR Code" className="mx-auto mb-4" />
              <div className="w-full flex justify-center items-center">
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
              </div>
            </div>
          )}
        </div>
      </GeneralModal>
    </>
  );
};

export default TwoFactor;
