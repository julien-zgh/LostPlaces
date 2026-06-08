import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Terms = () => {
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
              Terms of Service
            </h1>
          </div>

          {/* Content */}
          <div className="prose prose-stone max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                By accessing and using LostPlaces, you accept and agree to be
                bound by the terms and provision of this agreement. If you do
                not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                2. Content Submission
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Users may submit information about historical places, including
                photos, descriptions, and location data. By submitting content,
                you grant LostPlaces a non-exclusive, worldwide, royalty-free
                license to use, display, and distribute your content.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Content must be accurate and truthful</li>
                <li>
                  You must own or have permission to share any photos submitted
                </li>
                <li>
                  Content should respect cultural heritage and historical
                  significance
                </li>
                <li>Inappropriate or offensive content will be removed</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                3. User Conduct
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Users agree to use the platform responsibly and respect
                World's cultural heritage:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Do not damage or disturb historical sites</li>
                <li>Respect private property and local regulations</li>
                <li>Share information that helps preserve cultural heritage</li>
                <li>Be respectful in interactions with other users</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                4. Privacy and Data
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Your privacy is important to us. Please review our Privacy
                Policy to understand how we collect, use, and protect your
                information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                5. Disclaimer
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                LostPlaces provides information as-is. We do not guarantee
                the accuracy of user-submitted content. Users visit historical
                sites at their own risk and should exercise caution, especially
                at abandoned or ruined locations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                6. Contact
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these terms, please contact us at{" "}
                <a
                  href="mailto:legal@lostplaces.com"
                  className="text-terracotta hover:underline"
                >
                  legal@lostplaces.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
