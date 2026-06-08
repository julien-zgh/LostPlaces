import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Eye, Database, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Privacy = () => {
  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content:
        "We collect information you provide when creating an account, submitting places, and using our platform.",
    },
    {
      icon: Eye,
      title: "How We Use Information",
      content:
        "Your information helps us provide and improve our services, moderate content, and communicate with users.",
    },
    {
      icon: Shield,
      title: "Information Protection",
      content:
        "We implement security measures to protect your personal information and only share data as outlined in this policy.",
    },
    {
      icon: Users,
      title: "Your Rights",
      content:
        "You have the right to access, update, or delete your personal information at any time.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-8">
            <Link to="/" className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </Button>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
              Privacy Policy
            </h1>
          </div>

          {/* Key Points Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {sections.map((section, index) => (
              <Card key={index} className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-terracotta/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <section.icon className="w-6 h-6 text-terracotta" />
                    </div>
                    <div>
                      <h3 className="text-lg font-serif font-semibold text-foreground mb-2">
                        {section.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Content */}
          <div className="prose prose-stone max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                Information We Collect
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <h3 className="text-lg font-medium text-foreground">
                  Account Information
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Email address and username</li>
                  <li>Profile information you choose to provide</li>
                  <li>Authentication data</li>
                </ul>

                <h3 className="text-lg font-medium text-foreground">
                  Content You Submit
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Photos and descriptions of historical places</li>
                  <li>Location data and coordinates</li>
                  <li>Comments and interactions</li>
                </ul>

                <h3 className="text-lg font-medium text-foreground">
                  Usage Information
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Pages you visit and features you use</li>
                  <li>Device information and IP address</li>
                  <li>Browser type and operating system</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                How We Use Your Information
              </h2>
              <div className="text-muted-foreground leading-relaxed">
                <p className="mb-4">We use collected information to:</p>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Provide and maintain our platform services</li>
                  <li>Moderate content and prevent abuse</li>
                  <li>Communicate important updates</li>
                  <li>Improve user experience and platform features</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                Information Sharing
              </h2>
              <div className="text-muted-foreground leading-relaxed">
                <p className="mb-4">
                  We do not sell or rent your personal information. We may share
                  information only in these situations:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>With your explicit consent</li>
                  <li>To comply with legal requirements</li>
                  <li>To protect our rights and users' safety</li>
                  <li>In case of business transfer (with notice)</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                Data Security
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We implement appropriate security measures to protect your
                information against unauthorized access, alteration, disclosure,
                or destruction. However, no method of transmission over the
                internet is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                Your Rights
              </h2>
              <div className="text-muted-foreground leading-relaxed">
                <p className="mb-4">You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Access your personal information</li>
                  <li>Update or correct your data</li>
                  <li>Delete your account and data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Request data portability</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                For privacy-related questions or to exercise your rights,
                contact us at{" "}
                <a
                  href="mailto:privacy@lostplaces.com"
                  className="text-terracotta hover:underline"
                >
                  privacy@lostplaces.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
