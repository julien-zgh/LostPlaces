import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Users,
  MapPin,
  Camera,
  Shield,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Cultural Preservation",
      description:
        "We're passionate about preserving World's rich historical heritage for future generations.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description:
        "Our platform thrives on the contributions and knowledge of explorers and history enthusiasts.",
    },
    {
      icon: Shield,
      title: "Respectful Exploration",
      description:
        "We promote responsible exploration that respects historical sites and local communities.",
    },
  ];

  const features = [
    {
      icon: MapPin,
      title: "Interactive Mapping",
      description:
        "Discover places through our intuitive map interface with detailed location information.",
    },
    {
      icon: Camera,
      title: "Visual Documentation",
      description:
        "Share and explore historical sites through high-quality photographs and stories.",
    },
    {
      icon: Target,
      title: "Curated Content",
      description:
        "Our team reviews submissions to ensure quality and accuracy of historical information.",
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
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
              About LostPlaces
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discovering and preserving World's hidden historical treasures
              through community collaboration and modern technology.
            </p>
          </div>

          {/* Mission Section */}
          <section className="mb-16">
            <div className="bg-terracotta/5 rounded-lg p-8 border border-terracotta/10">
              <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                Our Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                World is home to countless historical sites, from ancient
                ruins and abandoned villages to forgotten fortresses and hidden
                archaeological treasures. Many of these places risk being lost
                to time, development, or neglect. LostPlaces was created to
                document, preserve, and share these important pieces of our
                cultural heritage through the power of community collaboration.
              </p>
            </div>
          </section>

          {/* Values */}
          <section className="mb-16">
            <h2 className="text-3xl font-serif font-bold text-foreground text-center mb-8">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="border-border text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-8 h-8 text-terracotta" />
                    </div>
                    <h3 className="text-lg font-serif font-semibold text-foreground mb-2">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* What We Offer */}
          <section className="mb-16">
            <h2 className="text-3xl font-serif font-bold text-foreground text-center mb-8">
              What We Offer
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-olive/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-olive" />
                      </div>
                      <div>
                        <h3 className="text-lg font-serif font-semibold text-foreground mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Story Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-6">
              Our Story
            </h2>
            <div className="prose prose-stone max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-4">
                LostPlaces was born from a passion for world history and a
                concern for the rapid disappearance of our cultural landmarks.
                As urban development accelerates and natural elements take their
                toll, many significant historical sites remain undocumented and
                vulnerable.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our platform brings together archaeologists, historians,
                photographers, and curious explorers to create a comprehensive
                digital archive of World's hidden heritage. Each submission
                helps build a collective memory that transcends individual
                experiences and preserves these places for future generations.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Whether it's a Crusader castle tucked away in the mountains, a
                Roman bridge in a remote valley, or an abandoned village with
                stories to tell, every place has value and deserves to be
                remembered.
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center bg-olive/5 rounded-lg p-8 border border-olive/10">
            <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
              Join Our Community
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Help us preserve World's heritage by sharing places you've
              discovered or exploring locations documented by fellow community
              members.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-terracotta hover:bg-terracotta/90"
              >
                <Link to="/submit">Contribute a Place</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-olive text-olive hover:bg-olive hover:text-white"
              >
                <Link to="/map">Explore Map</Link>
              </Button>
            </div>
          </section>

          {/* Contact Section */}
          <section className="mt-16 text-center">
            <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
              Get in Touch
            </h2>
            <p className="text-muted-foreground mb-4">
              Have questions, suggestions, or want to collaborate? We'd love to
              hear from you.
            </p>
            <p className="text-muted-foreground">
              Contact us at{" "}
              <a
                href="mailto:info@lostplaces.com"
                className="text-terracotta hover:underline"
              >
                info@lostplaces.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
