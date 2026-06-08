import { Link } from "react-router-dom";
import { MapPin, Camera, Users, Plus, Stars, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Scene3D from "@/components/Scene3d";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCategoriesStore } from "@/lib/zustand/CategoriesStore";
import { motion } from "framer-motion";
import BlurText from "@/components/BlurText";

export const Home = () => {
  const features = [
    {
      icon: MapPin,
      title: "Interactive Map",
      description:
        "Explore lost places across World with our interactive map showing detailed locations and stories.",
    },
    {
      icon: Camera,
      title: "Share Stories",
      description:
        "Upload photos and share the stories behind World's forgotten historical sites.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description:
        "Join a community of explorers dedicated to preserving World's hidden heritage.",
    },
  ];

  const [mostRated, setMostRated] = useState([]);
  const [places, setPlaces] = useState([]);
  const categories = useCategoriesStore((state) => state.categories);
  const [isLoading, setIsLoading] = useState(false);

  const loggedIn = localStorage.getItem("loggedIn") === "true";

  const fetchMostRatedLocations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        "http://localhost:3000/api/fetchMostRatedLocations"
      );
      const data = await res.json();
      // console.log("most rated locations", data);
      setMostRated(data);
    } catch {
      toast.error("Failed to fetch top 3 most rated locations!");
      return;
    } finally {
      setIsLoading(true);
    }
  };

  const FetchMostRatedLocationsData = async () => {
    setIsLoading(true);
    try {
      // console.log("fetchiing data");
      // console.log(mostRated);
      const details = await Promise.all(
        mostRated.map(async (place) => {
          const res = await fetch(
            `http://localhost:3000/api/location/fetchLocationDetails/${place.placeId}`
          );
          const data = await res.json();
          // console.log("fetched data", data);
          return { ...place, ...data };
        })
      );
      setPlaces(details);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch top 3 most rated locations data!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMostRatedLocations();
  }, []);

  useEffect(() => {
    if (mostRated.length > 0) {
      FetchMostRatedLocationsData();
    }
  }, [mostRated]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-cream via-background to-stone/20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-stone-texture opacity-30"></div>

        {/* 3D Scene Background */}
        <div className="absolute inset-0 z-0">
          <Scene3D />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-background/80 backdrop-blur-sm rounded-2xl p-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl flex justify-center font-serif mx-auto font-bold text-foreground mb-6">
            <div>
              <BlurText
                text="Discover World's"
                className="inline-block"
                delay={150}
                animateBy="words"
                direction="top"
                stepDuration={0.5}
              />
              <span className="block text-terracotta mx-auto w-full">
                <BlurText
                  text="Hidden History"
                  className="inline-block"
                  delay={300}
                  animateBy="words"
                  direction="top"
                  stepDuration={0.5}
                />
              </span>
            </div>
          </h1>

          <p className="text-lg sm:text-xl text-stone mb-8 max-w-2xl mx-auto animate-fade-in">
            Uncover forgotten ruins, abandoned places, and lost heritage sites
            across World. Join our community in preserving the stories of our
            ancient land.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button
              size="lg"
              asChild
              className="bg-terracotta hover:bg-terracotta/90 text-white"
            >
              <Link to="/map" className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Explore Map</span>
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-terracotta text-terracotta hover:bg-terracotta hover:text-white"
            >
              <Link to={loggedIn ? "/submit" : "/login"} className="flex items-center space-x-2">
                <Camera className="w-5 h-5" />
                <span>Contribute a Place</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-terracotta/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-olive/10 rounded-full blur-xl"></div>
      </section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0.5, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ amount: 0.25, once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="py-20 bg-card"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
              Why Choose LostPlaces?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform makes it easy to discover, document, and share
              World's hidden historical treasures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.section
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.25, once: true }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                  delay: index * 0.4, // delay increases with each card
                }}
              >
                <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <feature.icon className="w-8 h-8 text-terracotta" />
                    </div>
                    <h3 className="text-xl font-serif font-semibold text-foreground mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.section>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Recent Places Section */}
      <motion.section
        className="py-20 bg-background"
        initial={{ opacity: 0.5, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.5, once: true }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
              Recently Discovered Places
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore the latest historical sites discovered by our community of
              explorers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {places.map((place) => (
              <Card
                key={place._id}
                className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={
                      import.meta.env.VITE_SUPABASE_STORAGE_URL +
                      place.images[0]
                    }
                    alt={place.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-terracotta text-white text-xs px-2 py-1 rounded-full">
                      {
                        categories.find((cat) => cat._id === place.category_id)
                          ?.category
                      }
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-serif font-semibold text-foreground mb-2">
                      {place.title}
                    </h3>
                    <div className="flex">
                      <Star size={20} />
                      <span className="text-terracotta font-bold">
                        {place.avgRating}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {`${place.country} - ${place.location}`}
                  </p>
                  <Button
                    variant="ghost"
                    className="mt-4 p-2 h-auto text-terracotta hover:text-terracotta/80"
                    asChild
                  >
                    <Link to={`/place/${place._id}`}>Learn more →</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              asChild
              className="border-terracotta text-terracotta hover:bg-terracotta hover:text-white"
            >
              <Link to="/map">View All Places</Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <section className="py-20 bg-terracotta/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
            Help Us Preserve World's Heritage
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Every lost place has a story. Share yours and contribute to
            preserving World's rich historical legacy for future generations.
          </p>
          <Button
            size="lg"
            asChild
            className="bg-terracotta hover:bg-terracotta/90 text-white"
          >
            <Link to="/submit" className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add a Place</span>
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};
