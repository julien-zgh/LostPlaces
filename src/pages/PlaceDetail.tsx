import { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Camera,
  Flag,
  ArrowLeft,
  Share2,
  Contact,
  Info,
  Phone,
  Instagram,
  Facebook,
  Globe,
  Mail,
  Bookmark,
  Star,
  User,
  Earth,
  MapPinCheck,
  Route,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ExplorerProfile, Place } from "@/lib/type";
import { useCategoriesStore } from "@/lib/zustand/CategoriesStore";
import { Loading } from "@/components/Loading";
import SafeHtmlRenderer from "@/components/SafeHtmlRenderer/renderer";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { FaTiktok } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import GeneralModal from "@/components/Modal/GeneralModal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/lib/zustand/UserStore";
import { useUserRole } from "@/hooks/getUserRole";

const UserRating = ({ userId }: { userId: string }) => {
  const [username, setUsername] = useState({
    name: "",
  });

  const fetchUserName = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/user/${userId}`);
      if (!res.ok) {
        toast.error("Failed to fetch username for ratings");
      }
      const data = await res.json();
      // console.log("fetched username", data);
      setUsername(data);
    } catch {
      toast.error("Failed to fetch username for ratings");
    }
  };

  useEffect(() => {
    fetchUserName();
  }, []);

  return (
    <p className="flex">
      <span className="text-terracotta flex">
        <User size={20} />
        <b>User:</b>
      </span>
      &nbsp;
      <span className="capitalize">{username.name}</span>
    </p>
  );
};

export const PlaceDetail = () => {
  const { id } = useParams();
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  const navigate = useNavigate();
  const [place, setPlace] = useState<Place>({
    _id: "",
    sub_id: "",
    user_id: "",
    title: "",
    description: "",
    category_id: "",
    country: "",
    location: "",
    coords: [0, 0],
    images: [],
    status: "pending",
    rejection_reason: "",
    phone: ["", ""],
    email: "",
    website: ["", ""],
    facebook: ["", ""],
    instagram: ["", ""],
    tiktok: ["", ""],
    createdAt: "",
    updatedAt: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [satelliteStyle, setSatelliteStyle] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [explorer, setExplorer] = useState<ExplorerProfile>({
    firstName: "",
    lastName: "",
    profile_pic: "",
  });
  const [isReporting, setIsReporting] = useState(false); // boolean for modal
  const [reportCause, setReportCause] = useState("");
  const [reporting, setReporting] = useState(false); // boolean for loading state

  const [rating, setRating] = useState(0); // Current saved rating
  const [stars, setStars] = useState(0); // Hover preview
  const [ratedStars, setRatedStars] = useState(0);

  const [locationBookmarked, setLocationBookmarked] = useState(false);
  const [locationVisited, setLocationVisited] = useState(false);

  const [nearbyPlaces, setNearbyPlaces] = useState([]);

  const [allRatings, setAllRatings] = useState([]);
  const averageRating =
    allRatings && allRatings.length > 0
      ? allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length
      : 0;

  const categories = useCategoriesStore((state) => state.categories);
  const { user } = useUserStore();
  const { role } = useUserRole(user?._id || "");

  // MapLibre refs & state
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);
  const [markerPosition, setMarkerPosition] = useState({
    latitude: 0,
    longitude: 0,
  });
  let userMarker: maplibregl.Marker | null = null;

  const fetchUserStarRating = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/location/rating/${id}/${user._id}`
      );
      const data = await res.json();

      // data.rating will always exist (default 0 if no record found)
      setRatedStars(data.rating);
      setStars(data.rating);
    } catch {
      // console.error(error);
      setRatedStars(0);
      setStars(0);
      toast.error("Could not fetch star rating");
    }
  };

  const fetchIsLocationBookmarked = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/location/bookmarked/${id}/${user._id}`
      );

      const data = await res.json();
      // console.log(data);
      setLocationBookmarked(data);
    } catch {
      toast.error("could not check if location is bookmarked");
      return;
    }
  };

  const fetchIsLocationVisited = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/location/visited/${id}/${user._id}`
      );

      const data = await res.json();
      // console.log(data);
      setLocationVisited(data);
    } catch {
      toast.error("could not check if location is bookmarked");
      return;
    }
  };

  useEffect(() => {
    if (!user?._id || !id) return;
    fetchUserStarRating();
    fetchIsLocationBookmarked();
    fetchIsLocationVisited();
  }, [id, user?._id]);

  const fetchExplorerProfile = async (user_id: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/fetchExplorerProfile/${user_id}`
      );
      if (!res.ok) {
        toast.error("error while trying to fetch explorer profile");
      }
      const data = await res.json();
      // console.log(data);
      setExplorer(data);
    } catch {
      toast.error(`error while trying to fetch explorer profile`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLocationRatings = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/fetchLocationRatings/${id}`
      );
      const data = await res.json();
      // console.log("ratings", data);
      setAllRatings(data);
    } catch {
      toast.error("Failed to fetch location information");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNearbyPlaces = async (placeId: string, coords: number[]) => {
    setIsLoading(true);
    try {
      const id = place._id;
      const [lat, lon] = place.coords; // remember coords = [lon, lat]
      const res = await fetch(
        `http://localhost:3000/api/location/fetchNearbyLocations?lat=${coords[0]}&lon=${coords[1]}&id=${placeId}`
      );
      const data = await res.json();
      // console.log(data);
      setNearbyPlaces(data);
    } catch {
      toast.error("Failed to fetch nearby locations");
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLocationDetails = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/location/fetchLocationDetails/${id}`
      );
      const data = await res.json();
      // console.log(data);
      if(data.message === "Could not find that location") {
        navigate("/");
        return;
      }
      // console.log(data);
      setPlace(data);
      setMarkerPosition({
        latitude: data.coords[0],
        longitude: data.coords[1],
      });
      if (data._id && data.coords[0] !== 0 && data.coords[1] !== 0) {
        fetchNearbyPlaces(data._id, data.coords);
      }
      fetchExplorerProfile(data.user_id);
      fetchLocationRatings();
    } catch {
      toast.error("Failed to fetch location information");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocationDetails();
  }, [id]);

  // Initialize map once, after the first valid coords are set
  useEffect(() => {
    if (!mapContainer.current) return;
    if (markerPosition.latitude === 0 && markerPosition.longitude === 0) return;

    // Destroy previous map if exists
    if (map.current) {
      map.current.remove();
      map.current = null;
      marker.current = null;
    }

    // Initialize new map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: satelliteStyle
        ? `https://api.maptiler.com/maps/satellite/style.json?key=${
            import.meta.env.VITE_SATELLITE_MAP_KEY
          }`
        : "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: [markerPosition.longitude, markerPosition.latitude],
      zoom: 15,
    });

    marker.current = new maplibregl.Marker({ color: "#cb774a" })
      .setLngLat([markerPosition.longitude, markerPosition.latitude])
      .addTo(map.current);
  }, [markerPosition, id, satelliteStyle]);

  const getUserLocation = (): Promise<[number, number]> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation is not supported by your browser");
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) =>
            resolve([position.coords.longitude, position.coords.latitude]),
          (err) => {
            switch (err.code) {
              case err.PERMISSION_DENIED:
                toast.error("You denied access to your location.");
                break;
              case err.POSITION_UNAVAILABLE:
                toast.error("Your location is unavailable.");
                break;
              case err.TIMEOUT:
                toast.error("Location request timed out.");
                break;
              default:
                toast.error("Unknown error getting location.");
            }
            reject(err);
          }
        );
      }
    });
  };

  const getRouteFromAPI = async (
    start: [number, number],
    end: [number, number]
  ): Promise<GeoJSON.Feature<GeoJSON.LineString> | null> => {
    try {
      const ghApiKey = import.meta.env.VITE_GRAPH_HOPPER_API_KEY;
      const url = `https://graphhopper.com/api/1/route?point=${start[1]},${
        start[0]
      }&point=${end[1]},${
        end[0]
      }&vehicle=car&points_encoded=false&locale=en&instructions=false&key=${
        import.meta.env.VITE_ROUTE_API_KEY
      }`;

      // console.log("GraphHopper request URL:", url);

      const response = await fetch(url);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          `GraphHopper request failed: ${response.status} ${text}`
        );
      }

      const data = await response.json();
      // console.log("GraphHopper response:", data);

      const coords = data.paths?.[0]?.points?.coordinates;
      if (!coords || coords.length < 2) {
        console.warn("Invalid route geometry from GraphHopper.");
        toast.warning("Could not generate a route for these locations.");
        return null;
      }

      return {
        type: "Feature",
        properties: {},
        geometry: { type: "LineString", coordinates: coords },
      };
    } catch (err) {
      console.error("Error fetching route:", err);
      throw err;
    }
  };

  const showRoute = async () => {
    if (!map.current) return;

    try {
      const userCoords = await getUserLocation(); // [lng, lat]
      const destCoords: [number, number] = [
        markerPosition.longitude,
        markerPosition.latitude,
      ];
      // console.log("User coords:", userCoords);
      // console.log("Destination coords:", destCoords);

      // Remove old user marker if exists
      if (userMarker) {
        userMarker.remove();
        userMarker = null;
      }

      // Add a marker for the user location
      userMarker = new maplibregl.Marker({ color: "#007cbf" }) // blue marker for user
        .setLngLat(userCoords)
        .addTo(map.current);

      // Fetch route from GraphHopper
      const routeGeoJSON = await getRouteFromAPI(userCoords, destCoords);

      if (!routeGeoJSON) return;

      // Remove existing route if exists
      if (map.current.getSource("route")) {
        map.current.removeLayer("route-layer");
        map.current.removeSource("route");
      }

      map.current.addSource("route", {
        type: "geojson",
        data: routeGeoJSON,
      });

      map.current.addLayer({
        id: "route-layer",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#cb774a",
          "line-width": 5,
        },
      });

      // Fit map bounds to show the route
      const bounds = new maplibregl.LngLatBounds();
      routeGeoJSON.geometry.coordinates.forEach((coord) =>
        bounds.extend(coord as [number, number])
      );
      map.current.fitBounds(bounds, { padding: 50 });
    } catch (error) {
      toast.error("Could not get your location or route.");
      // console.error(error);
    }
  };


  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const handleReport = async () => {
    setReporting(true);
    try {
      if (!reportCause) {
        toast.error("Please fill report cause to submit!");
        return;
      }

      const res = await fetch("http://localhost:3000/api/location/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: place.title,
          url: window.location.href,
          reason: reportCause,
        }),
      });
      if (!res.ok) {
        toast.error("Failed to report location. Please try again later!");
        return;
      }
      setIsReporting(false);
      toast.success("Thank you for your report. We'll review this place.");
    } catch {
      toast.error("Something wrong happened. Please try again later!");
    }
    setReporting(false);
  };

  const handleRemoveFromWhishlit = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/location/removeLocation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            placeId: id,
            userId: user._id,
          }),
        }
      );
      if (!res.ok) {
        toast.error("Something wrong happened. Please try again later!");
        return;
      }
      setLocationBookmarked(false);
      toast.success("Place removed from whishlist");
    } catch {
      toast.error("Something wrong happened. Please try again later!");
      return;
    }
  };

  const handleSave = async () => {
    try {
      const loggedIn = localStorage.getItem("loggedIn") === "true";
      if (loggedIn) {
        const res = await fetch(
          "http://localhost:3000/api/location/saveLocation",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              placeId: id,
              userId: user._id,
            }),
          }
        );
        if (!res.ok) {
          toast.error("Something wrong happened. Please try again later!");
        }
        setLocationBookmarked(true);
      }
    } catch {
      toast.error("Something wrong happened. Please try again later!");
      return;
    }
  };

  const handleUnmarkVisited = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/location/unmarkLocation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            placeId: id,
            userId: user._id,
          }),
        }
      );
      if (!res.ok) {
        toast.error("Something wrong happened. Please try again later!");
        return;
      }
      setLocationVisited(false);
    } catch {
      toast.error("Something wrong happened. Please try again later!");
      return;
    }
  };

  const handleMarkVisited = async () => {
    try {
      const loggedIn = localStorage.getItem("loggedIn") === "true";
      if (loggedIn) {
        const res = await fetch(
          "http://localhost:3000/api/location/markVisited",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              placeId: id,
              userId: user._id,
            }),
          }
        );
        if (!res.ok) {
          toast.error("Something wrong happened. Please try again later!");
          return;
        }
        setLocationVisited(true);
      }
    } catch {
      toast.error("Something wrong happened. Please try again later!");
      return;
    }
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    index: number
  ) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const value = x < width / 2 ? index - 0.5 : index;
    setStars(value);
  };

  const handleMouseLeave = () => {
    if (ratedStars) {
      setStars(ratedStars);
    } else {
      setStars(0);
    }
  };

  const handleStarRatingClick = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (role === "explorer") {
      toast.error("You can not rate this place!");
      return;
    }
    setRating(stars);
    const res = await fetch("http://localhost:3000/api/location/rate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        placeId: place._id,
        userId: user._id,
        rating: stars,
      }),
    });
    if (!res.ok) {
      const msg = await res.json();
      toast.error(msg.message);
      return;
    }
    fetchUserStarRating();
    fetchLocationRatings();
    toast.success(`This place was rated successfully!`);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === place.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? place.images.length - 1 : prev - 1
    );
  };

  if (isLoading || !place) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2 sm:gap-0">
            {/* Back Button */}
            <Button variant="ghost" asChild className="w-full sm:w-auto">
              <Link
                to="/map"
                className="flex items-center justify-center sm:justify-start space-x-2 w-full sm:w-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Map</span>
              </Link>
            </Button>

            {/* Action Buttons */}
            <div className="flex flex-wrap sm:flex-nowrap justify-center sm:justify-end gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex-1 sm:flex-none"
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>

              {/* report button */}
              {role !== "explorer" && role !== "admin" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsReporting(true)}
                  className="flex-1 sm:flex-none"
                >
                  <Flag className="w-4 h-4 mr-1" />
                  Report
                </Button>
              )}

              {/* save button */}
              {isLoggedIn &&
                role !== "explorer" &&
                role !== "admin" &&
                (locationBookmarked ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveFromWhishlit}
                    className="flex-1 sm:flex-none"
                  >
                    <Bookmark className="w-4 h-4 mr-1 text-black fill-current stroke-none" />
                    Remove from wishlist
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSave}
                    className="flex-1 sm:flex-none"
                  >
                    <Bookmark className="w-4 h-4 mr-1" />
                    Add to Wishlist
                  </Button>
                ))}

              {/* visited button */}
              {isLoggedIn &&
                role !== "explorer" &&
                role !== "admin" &&
                (locationVisited ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUnmarkVisited}
                    className="flex-1 sm:flex-none"
                  >
                    <MapPinCheck className="w-4 h-4 mr-1 text-black" />
                    Marked as Visited
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMarkVisited}
                    className="flex-1 sm:flex-none"
                  >
                    <MapPin className="w-4 h-4 mr-1" />
                    Mark as Visited
                  </Button>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative">
                <div className="aspect-video bg-muted">
                  <img
                    src={
                      import.meta.env.VITE_SUPABASE_STORAGE_URL +
                        place.images[currentImageIndex] || ""
                    }
                    alt={place.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {place.images.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm"
                    >
                      ←
                    </Button>
                    <Button
                      variant="outline"
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm"
                    >
                      →
                    </Button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {place.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full ${
                            index === currentImageIndex
                              ? "bg-white"
                              : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              {place.images.length > 1 && (
                <div className="p-4 flex space-x-2 overflow-x-auto">
                  {place.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${
                        index === currentImageIndex
                          ? "border-terracotta"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={import.meta.env.VITE_SUPABASE_STORAGE_URL + image}
                        alt={`${place.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </Card>

            {/* Title and Basic Info */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Badge className="bg-terracotta">
                  {
                    categories.find((cat) => cat._id === place.category_id)
                      ?.category
                  }
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl  font-bold text-foreground mb-4">
                {place.title}
              </h1>
              <div className="flex flex-wrap items-center text-muted-foreground space-x-6 text-sm">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{place.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Added {new Date(place.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Camera className="w-4 h-4" />
                  <span>{place.images.length} photos</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex">
                  <Info /> About This Place
                </h2>
                <div className="prose prose-gray max-w-none">
                  <SafeHtmlRenderer html={place.description} />
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            {((Array.isArray(place.phone) &&
              place.phone.some((p) => p.trim() !== "")) ||
              (place.email && place.email.trim() !== "") ||
              (Array.isArray(place.website) &&
                place.website.some((w) => w.trim() !== "")) ||
              (Array.isArray(place.facebook) &&
                place.facebook.some((f) => f.trim() !== "")) ||
              (Array.isArray(place.instagram) &&
                place.instagram.some((i) => i.trim() !== "")) ||
              (Array.isArray(place.tiktok) &&
                place.tiktok.some((t) => t.trim() !== ""))) && (
              <Card className="shadow-md rounded-2xl border border-gray-100">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6 border-b pb-3">
                    <Contact className="w-6 h-6 text-gray-700" />
                    <h2 className="text-2xl font-semibold text-gray-800 ">
                      Contact Information
                    </h2>
                  </div>

                  <div className="space-y-5">
                    {/* URLs in a grid: 2 per line */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* PHONE */}
                      {Array.isArray(place.phone) &&
                        place.phone.some((p) => p.trim() !== "") && (
                          <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-blue-500" />
                            <a
                              href={`tel:${place.phone[0]}${place.phone[1]}`}
                              className="text-gray-700 hover:text-blue-600 transition"
                            >
                              {place.phone
                                .filter((p) => p.trim() !== "")
                                .join(" ")}
                            </a>
                          </div>
                        )}

                      {/* EMAIL */}
                      {place.email && place.email.trim() !== "" && (
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-red-500" />
                          <a
                            href={`mailto:${place.email}`}
                            className="text-gray-700 hover:text-blue-600 transition"
                          >
                            {place.email}
                          </a>
                        </div>
                      )}
                      {/* WEBSITE */}
                      {Array.isArray(place.website) &&
                        place.website.some((w) => w.trim() !== "") && (
                          <div className="flex items-center gap-3">
                            <Globe className="w-5 h-5 text-green-500" />
                            <Link
                              to={place.website[1]}
                              target="_blank"
                              className="text-gray-700 hover:text-green-600 transition"
                            >
                              {place.website[0]}
                            </Link>
                          </div>
                        )}

                      {/* FACEBOOK */}
                      {Array.isArray(place.facebook) &&
                        place.facebook.some((f) => f.trim() !== "") && (
                          <div className="flex items-center gap-3">
                            <Facebook className="w-5 h-5 text-blue-700" />
                            <Link
                              to={place.facebook[1]}
                              target="_blank"
                              className="text-gray-700 hover:text-blue-600 transition"
                            >
                              {place.facebook[0]}
                            </Link>
                          </div>
                        )}

                      {/* INSTAGRAM */}
                      {Array.isArray(place.instagram) &&
                        place.instagram.some((i) => i.trim() !== "") && (
                          <div className="flex items-center gap-3">
                            <Instagram className="w-5 h-5 text-pink-500" />
                            <Link
                              to={place.instagram[1]}
                              target="_blank"
                              className="text-gray-700 hover:text-pink-500 transition"
                            >
                              {place.instagram[0]}
                            </Link>
                          </div>
                        )}

                      {/* TIKTOK */}
                      {Array.isArray(place.tiktok) &&
                        place.tiktok.some((t) => t.trim() !== "") && (
                          <div className="flex items-center gap-3">
                            <FaTiktok className="w-5 h-5 text-black" />
                            <Link
                              to={place.tiktok[1]}
                              target="_blank"
                              className="text-gray-700 hover:text-black transition"
                            >
                              {place.tiktok[0]}
                            </Link>
                          </div>
                        )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Map */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex justify-between">
                  Location
                  <div className="space-x-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-10 h-10 p-0 bg-white/90 backdrop-blur-sm"
                      onClick={showRoute}
                    >
                      <Route />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-10 h-10 p-0 bg-white/90 backdrop-blur-sm"
                      onClick={() => setSatelliteStyle(!satelliteStyle)}
                    >
                      <Earth />
                    </Button>
                  </div>
                </h3>
                <div className="aspect-square bg-stone/10 rounded-lg border-2 border-dashed border-stone/30 flex items-center justify-center mb-4">
                  <div
                    ref={mapContainer}
                    className="h-full w-full rounded-lg overflow-hidden shadow-md"
                  />
                </div>
                <div className="text-sm space-y-2">
                  <div>
                    <span className="font-medium">Address:</span>
                    <p className="text-muted-foreground">{`${place.country} - ${place.location}`}</p>
                  </div>
                  <div>
                    <span className="font-medium">Coordinates:</span>
                    <p className="text-muted-foreground font-mono text-xs">
                      {place.coords[0]}, {place.coords[1]}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nearby Places */}
            {nearbyPlaces && nearbyPlaces.length !== 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Nearby Places
                  </h3>
                  <div className="space-y-3">
                    {nearbyPlaces.map((nearbyPlace, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span
                          className="text-sm text-foreground flex items-center hover:cursor-pointer hover:text-terracotta hover:underline"
                          onClick={() => navigate(`/place/${nearbyPlace._id}`)}
                        >
                          <img
                            src={
                              import.meta.env.VITE_SUPABASE_STORAGE_URL +
                              nearbyPlace.images[0]
                            }
                            alt="Nearby Place Thumbnail"
                            className="w-1/5 rounded mr-2"
                          />
                          {nearbyPlace.title.length > 15
                            ? nearbyPlace.title.substring(0, 15) + "..."
                            : nearbyPlace.title}
                        </span>
                        <span className="text-xs text-muted-foreground w-full">
                          {parseInt(nearbyPlace.distance) < 1000
                            ? `< 1km`
                            : parseInt(nearbyPlace.distance) < 5000
                            ? "< 5km"
                            : "5+ km"}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contributor Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Contributed By
                </h3>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <Avatar className="w-10 h-10">
                      {explorer?.profile_pic ? (
                        <AvatarImage
                          src={explorer.profile_pic}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="bg-terracotta text-white p-2 rounded-full">
                          <AvatarFallback>
                            {explorer.firstName && explorer.lastName
                              ? `${explorer.firstName[0].toUpperCase()}${explorer.lastName[0].toUpperCase()}`
                              : "LU"}
                          </AvatarFallback>
                        </div>
                      )}
                    </Avatar>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      <span>
                        {explorer?.firstName} {explorer?.lastName}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Heritage Explorer
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Star Rating */}
            {isLoggedIn && role !== "admin" && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Your Rating
                  </h3>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star, index) => (
                      <div
                        key={index}
                        className="relative w-10 h-10 cursor-pointer"
                        onMouseMove={(e) => handleMouseMove(e, star)}
                        onMouseLeave={handleMouseLeave}
                        onClick={handleStarRatingClick}
                      >
                        {/* Background empty star */}
                        <Star className="absolute inset-0 w-10 h-10 text-gray-300" />

                        {/* Filled star based on hover or rating */}
                        <div
                          className="absolute inset-0 overflow-hidden"
                          style={{
                            width: `${
                              Math.min(
                                1,
                                Math.max(0, (stars || rating) - (star - 1))
                              ) * 100
                            }%`,
                          }}
                        >
                          <Star className="w-10 h-10 text-yellow-400 fill-yellow-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Average Rating
                </h3>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star, index) => (
                    <div key={index} className="relative w-10 h-10">
                      {/* Empty star */}
                      <Star className="absolute inset-0 w-10 h-10 text-gray-300" />

                      {/* Filled star based on average */}
                      <div
                        className="absolute inset-0 overflow-hidden"
                        style={{
                          width: `${
                            Math.min(
                              1,
                              Math.max(0, averageRating - (star - 1))
                            ) * 100
                          }%`,
                        }}
                      >
                        <Star className="w-10 h-10 text-yellow-400 fill-yellow-400" />
                      </div>
                    </div>
                  ))}

                  {/* Show numeric average */}
                  <span className="ml-2 text-gray-700 font-medium">
                    {averageRating.toFixed(1)} / 5
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Ratings
                </h3>
                <div className="flex flex-col w-full space-y-3">
                  {!allRatings || allRatings.length === 0 ? (
                    <h2>No ratings for this location</h2>
                  ) : (
                    allRatings.map((rating, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-[250px_auto] w-full items-center"
                      >
                        {/* Left side – User (fixed width column) */}
                        <div className="flex items-center">
                          <UserRating userId={rating.userId} />
                        </div>

                        {/* Right side – Rating */}
                        <div className="flex items-center">
                          <span className="text-terracotta flex items-center">
                            <Star size={20} />
                            <b className="ml-1">Rating:</b>
                          </span>
                          <span className="ml-2">{rating.rating}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {isReporting && (
        <GeneralModal
          isOpen={isReporting}
          onClose={() => setIsReporting(false)}
        >
          <div className="p-4">
            <h1 className="text-center text-xl font-semibold">
              Are you sure you want to report this location?
            </h1>
            <div className="text-center mt-3">
              <Label htmlFor="report">
                Why are you reporting this location?
              </Label>
              <Input
                className="mt-3"
                type="text"
                name="report"
                placeholder="Report Cause..."
                value={reportCause}
                onChange={(e) => setReportCause(e.currentTarget.value)}
              />
            </div>

            <div className="w-full mt-4 flex justify-around align-center">
              <Button
                onClick={() => setIsReporting(false)}
                className="bg-white text-black border-2 hover:border-0 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReport}
                disabled={reporting}
                className="transition-all duration-300 ease-in-out hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {reporting ? "Reporting..." : "Report"}
              </Button>
            </div>
          </div>
        </GeneralModal>
      )}
    </div>
  );
};
