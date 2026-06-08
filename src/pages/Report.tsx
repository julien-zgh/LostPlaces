import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Send, ArrowLeft } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";

export const Report = () => {
  const [formData, setFormData] = useState({
    type: "",
    subject: "",
    description: "",
    email: "",
    placeUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Send Email to your inbox
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_REPORT_ABUSE_TEMPLATE_ID,
        e.currentTarget,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      // Send auto-reply to the user
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_REPORT_ABUSE_AUTO_REPLY_TEMPLATE_ID,
        {
          email: formData.email,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      toast.success(
        "Report submitted successfully. We'll review it within 24 hours."
      );

      // Reset form
      setFormData({
        type: "",
        subject: "",
        description: "",
        email: "",
        placeUrl: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };


  const reportTypes = [
    { value: "inappropriate", label: "Inappropriate Content" },
    { value: "spam", label: "Spam/Fake Place" },
    { value: "copyright", label: "Copyright Violation" },
    { value: "harassment", label: "Harassment/Abuse" },
    { value: "technical", label: "Technical Issue" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-background to-stone/20 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-terracotta/10 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-terracotta" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
            Report an Issue
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Help us maintain the quality and safety of LostPlaces by reporting
            any issues or concerns.
          </p>
        </div>

        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center text-terracotta hover:text-terracotta/80 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Report Form Card */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-serif">
              Submit a Report
            </CardTitle>
            <CardDescription>
              Please provide as much detail as possible to help us address your
              concern effectively.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="type">Report Type *</Label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="">Select a report type</option>
                  {reportTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  placeholder="Brief description of the issue"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="placeUrl">Place URL (if applicable)</Label>
                <Input
                  id="placeUrl"
                  name="placeUrl"
                  value={formData.placeUrl}
                  onChange={(e) =>
                    handleInputChange("placeUrl", e.target.value)
                  }
                  placeholder="https://lostplaces/place/123"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Please provide detailed information about the issue, including any relevant context or evidence..."
                  className="min-h-[120px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Your Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your@email.com"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  We'll use this to contact you about your report if needed.
                </p>
              </div>

              <div className="bg-stone/10 border border-stone/20 rounded-lg p-4">
                <h3 className="font-medium text-sm mb-2">Before submitting:</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Ensure you've selected the correct report type</li>
                  <li>• Provide specific details and evidence when possible</li>
                  <li>• False reports may result in account restrictions</li>
                  <li>• We typically respond within 24-48 hours</li>
                </ul>
              </div>

              <Button
                type="submit"
                className="w-full bg-terracotta hover:bg-terracotta/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Submitting Report..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Report
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Additional Help */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-sm text-muted-foreground">
            Need immediate assistance? Contact us directly at{" "}
            <a
              href="mailto:support@lostplaces.com"
              className="text-terracotta hover:text-terracotta/80"
            >
              support@lostplaces.com
            </a>
          </p>
          <div className="flex justify-center space-x-4 text-sm">
            <Link
              to="/privacy"
              className="text-muted-foreground hover:text-terracotta"
            >
              Privacy Policy
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              to="/terms"
              className="text-muted-foreground hover:text-terracotta"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
