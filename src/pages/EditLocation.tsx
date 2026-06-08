import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { Camera, Upload, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import countries from "@/lib/Data/countries.json";
import { ICON_MAP } from "@/lib/utils/utils";
import { useUserStore } from "@/lib/zustand/UserStore";
import supabase from "../backend/supabaseClient";
import { useNavigate, useParams } from "react-router-dom";
import { Loading } from "@/components/Loading";

export const EditLocation = () => {
  const { id } = useParams();
  const user = useUserStore((state) => state.user);
  const [isOwner, setIsOwner] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    latitude: 0,
    longitude: 0,
    location: "",
    country: "",
    phone_code: "",
    phone_number: "",
    email: "",
    website_title: "",
    website_url: "",
    facebook_title: "",
    facebook_url: "",
    instagram_title: "",
    instagram_url: "",
    tiktok_title: "",
    tiktok_url: "",
    status: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [oldTitle, setOldTitle] = useState("");

  const [placeImages, setPlaceImages] = useState<string[]>([]);
  const [imagesToDelete, setImagestoDelete] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchPlaceDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/fetchPlaceDetails?id=${id}&user_id=${user._id}`
      );
      if (!res.ok) {
        setIsOwner(false);
        return;
      }
      setIsOwner(true);
      const data = await res.json();
      setFormData({
        title: data.title,
        description: data.description,
        category: data.category_id,
        country: data.country,
        location: data.location,
        phone_code: data.phone[0] || "",
        phone_number: data.phone[1] || "",
        email: data.email,
        website_title: data.website[0] || "",
        website_url: data.website[1] || "",
        facebook_title: data.facebook[0] || "",
        facebook_url: data.facebook[1] || "",
        instagram_title: data.instagram[0] || "",
        instagram_url: data.instagram[1] || "",
        tiktok_title: data.tiktok[0] || "",
        tiktok_url: data.tiktok[1] || "",
        latitude: data.coords[0],
        longitude: data.coords[1],
        status: data.status,
      });
      setOldTitle(data.title);
      setPlaceImages(data.images);
    } catch {
      setIsOwner(false);
      return;
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log(placeImages);
  }, [placeImages]);

  useEffect(() => {
    fetchPlaceDetails();
  }, [id, user]);

  useEffect(() => {
    if (!loading && !isOwner) {
      navigate("/");
    }
  }, [loading, isOwner, navigate]);

  // MapLibre refs & state
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);

  const [markerPosition, setMarkerPosition] = useState({
    latitude: formData.latitude,
    longitude: formData.longitude,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/categories", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setCategories(data);
      } catch (error) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setMarkerPosition({
      latitude: formData.latitude,
      longitude: formData.longitude,
    });
  }, [formData.latitude, formData.longitude]);

  // Initialize map & marker once
  useEffect(() => {
    if (!mapContainer.current) return;

    if (!map.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
        center: [markerPosition.longitude, markerPosition.latitude],
        zoom: 10,
      });
      map.current.setMaxZoom(17.5);

      marker.current = new maplibregl.Marker({
        draggable: true,
        color: "#cb774a",
      })
        .setLngLat([markerPosition.longitude, markerPosition.latitude])
        .addTo(map.current);

      marker.current.on("dragend", () => {
        const lngLat = marker.current!.getLngLat();
        setMarkerPosition({ latitude: lngLat.lat, longitude: lngLat.lng });
        setFormData((prev) => ({
          ...prev,
          latitude: parseFloat(lngLat.lat.toFixed(6)),
          longitude: parseFloat(lngLat.lng.toFixed(6)),
        }));
      });

      map.current.on("click", (e) => {
        const { lng, lat } = e.lngLat;
        marker.current!.setLngLat([lng, lat]);
        setMarkerPosition({ latitude: lat, longitude: lng });
        setFormData((prev) => ({
          ...prev,
          latitude: parseFloat(lat.toFixed(6)),
          longitude: parseFloat(lng.toFixed(6)),
        }));
        map.current!.flyTo({ center: [lng, lat], zoom: 17 });
      });
    } else {
      // update marker & map when markerPosition changes
      if (marker.current)
        marker.current.setLngLat([
          markerPosition.longitude,
          markerPosition.latitude,
        ]);
      map.current.flyTo({
        center: [markerPosition.longitude, markerPosition.latitude],
        zoom: 17,
      });
    }
  }, [markerPosition, mapContainer.current]);

  // Sync marker & map when coordinates inputs change
  const handleInputChange = (field: string, value: string) => {
    if (
      (field === "latitude" || field === "longitude") &&
      value.includes(",")
    ) {
      const parts = value.split(",").map((part) => part.trim());
      if (parts.length === 2) {
        const lat = parseFloat(parts[0]);
        const lng = parseFloat(parts[1]);
        if (!isNaN(lat) && !isNaN(lng)) {
          setFormData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
          }));
          setMarkerPosition({ latitude: lat, longitude: lng });
          if (map.current && marker.current) {
            marker.current.setLngLat([lng, lat]);
            map.current.flyTo({ center: [lng, lat], zoom: 17 });
          }
          return;
        }
      }
    }

    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "latitude") {
      const lat = parseFloat(value);
      if (!isNaN(lat) && markerPosition.longitude) {
        setMarkerPosition({
          latitude: lat,
          longitude: markerPosition.longitude,
        });
        setFormData((prev) => ({ ...prev, latitude: lat }));
        if (map.current && marker.current) {
          marker.current.setLngLat([markerPosition.longitude, lat]);
          map.current.flyTo({
            center: [markerPosition.longitude, lat],
            zoom: 8,
          });
        }
      }
    }
    if (field === "longitude") {
      const lng = parseFloat(value);
      if (!isNaN(lng) && markerPosition.latitude) {
        setMarkerPosition({
          latitude: markerPosition.latitude,
          longitude: lng,
        });
        setFormData((prev) => ({ ...prev, longitude: lng }));
        if (map.current && marker.current) {
          marker.current.setLngLat([lng, markerPosition.latitude]);
          map.current.flyTo({
            center: [lng, markerPosition.latitude],
            zoom: 8,
          });
        }
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Filter out deleted images from placeImages
    let remainingPlaceImages = placeImages.filter(
      (img) => !imagesToDelete.includes(img)
    );

    if (
      !formData.title ||
      !formData.description ||
      !formData.category ||
      !formData.location ||
      !formData.latitude ||
      !formData.longitude
    ) {
      toast.error("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      //check if title has changes
      if (formData.title !== oldTitle) {
        const olderTitle = oldTitle
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, "")
          .trim()
          .replace(/\s+/g, ".");

        //Get all files in the old folder
        const { data: mediaData, error: mediaError } = await supabase.storage
          .from("lostplaces")
          .list(`Uploads/${olderTitle}`);

        if (mediaError) {
          toast.error(`Failed to update images`);
          return;
        }

        //Copy files to the new folder
        const newTitle = formData.title
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, "")
          .trim()
          .replace(/\s+/g, ".");

        for (const media of mediaData) {
          const oldPath = `Uploads/${olderTitle}/${media.name}`;
          const newPath = `Uploads/${newTitle}/${media.name}`;
          const { error: copyError } = await supabase.storage
            .from("lostplaces")
            .copy(oldPath, newPath);

          if (copyError) {
            toast.error(`Failed to update images`);
            return;
          }
        }

        // Compute updated paths
        const updatedPlaceImages = placeImages.map((img) => {
          const parts = img.split("/");
          const fileName = parts[parts.length - 1];
          return `/Uploads/${newTitle}/${fileName}`;
        });

        // Filter out deleted images
        remainingPlaceImages = updatedPlaceImages.filter(
          (img) => !imagesToDelete.includes(img)
        );

        // Update state for UI
        setPlaceImages(updatedPlaceImages);

        //delete older folder
        const oldFilePaths = mediaData.map(
          (file) => `Uploads/${olderTitle}/${file.name}`
        );
        const { error: deleteError } = await supabase.storage
          .from("lostplaces")
          .remove(oldFilePaths);

        if (deleteError) {
          toast.error(`Failed to update images`);
          return;
        }
      }

      for (const imgPath of imagesToDelete) {
        const path = imgPath.startsWith("/") ? imgPath.slice(1) : imgPath;

        const { error } = await supabase.storage
          .from("lostplaces")
          .remove([path]);

        if (error) {
          toast.error(`Failed to delete image: ${imgPath}`);
          // console.error(error);
        }
      }

      // Prepare folder name from title (sanitize and format)
      const folderName = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .trim()
        .replace(/\s+/g, ".");

      // Upload images to Supabase Storage and collect their relative paths
      const imagePaths: string[] = [];

      for (const image of images) {
        const fileName = `${Date.now()}_${image.name}`;

        const { error } = await supabase.storage
          .from("lostplaces")
          .upload(`Uploads/${folderName}/${fileName}`, image);

        if (error) {
          throw new Error(`Failed to upload image: ${error.message}`);
        }

        // Store relative path to be saved in DB
        imagePaths.push(`/Uploads/${folderName}/${fileName}`);
      }

      // Prepare submission payload including relative image paths
      const submissionPayload = {
        ...(formData.title !== oldTitle && { sub_id: folderName }),
        user_id: user._id.toString(),
        title: formData.title,
        description: formData.description,
        category_id: formData.category,
        country: formData.country,
        location: formData.location,
        coords: [formData.latitude, formData.longitude],
        images: [...remainingPlaceImages, ...imagePaths],
        phone: [formData.phone_code, formData.phone_number],
        email: formData.email,
        website: [formData.website_title, formData.website_url],
        facebook: [formData.facebook_title, formData.facebook_url],
        instagram: [formData.instagram_title, formData.instagram_url],
        tiktok: [formData.tiktok_title, formData.tiktok_url],
        ...(formData.status === "approved" && { status: "pending" }),
      };

      // submit payload to your API
      const response = await fetch(
        `http://localhost:3000/api/location/update/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionPayload),
        }
      );

      if (!response.ok) {
        toast.error("Error while editing location details");
      }

      toast.success(
        "Place edited successfully! It will be reviewed by our team."
      );

      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message || "Submission failed.");
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
            Add a Lost Place
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Share a forgotten historical site and help preserve World's
            heritage. All submissions are reviewed before being published.
          </p>
        </div>

        {/* Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="w-5 h-5 text-terracotta" />
              <span>Place Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Place Name *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="e.g., Abandoned Monastery of Qadisha"
                  required
                />
              </div>
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <ReactQuill
                  value={formData.description}
                  onChange={(value) => handleInputChange("description", value)}
                  placeholder="Tell the story of this place. What makes it historically significant? What can visitors expect to see?"
                  theme="snow"
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, false] }],
                      ["bold", "italic", "underline"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link"],
                      ["clean"],
                    ],
                  }}
                  className="bg-background"
                />
              </div>
              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => {
                      const Icon = ICON_MAP[category.icon];
                      return (
                        <SelectItem key={category._id} value={category._id}>
                          {Icon && (
                            <Icon
                              style={{ marginRight: 8, color: "#cb774a" }}
                            />
                          )}{" "}
                          {category.category}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              {/* Country & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) =>
                      handleInputChange("country", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    placeholder="e.g., Bcharre, North Lebanon"
                    required
                  />
                </div>
              </div>

              <CardTitle className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-terracotta" />
                <span>Contact Information</span>
              </CardTitle>

              {/* Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone_code">Phone Code</Label>
                  <Input
                    id="phone_code"
                    value={formData.phone_code}
                    onChange={(e) =>
                      handleInputChange("phone_code", e.target.value)
                    }
                    placeholder="+961"
                    type="text"
                  />
                </div>
                <div>
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={(e) =>
                      handleInputChange("phone_number", e.target.value)
                    }
                    placeholder="70123456"
                    type="text"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  type="email"
                  placeholder="contact@example.com"
                />
              </div>
              {/* Website */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website_title">Website Title</Label>
                  <Input
                    id="website_title"
                    value={formData.website_title}
                    onChange={(e) =>
                      handleInputChange("website_title", e.target.value)
                    }
                    placeholder="My Website"
                    type="text"
                  />
                </div>
                <div>
                  <Label htmlFor="website_url">Website URL</Label>
                  <Input
                    id="website_url"
                    value={formData.website_url}
                    onChange={(e) =>
                      handleInputChange("website_url", e.target.value)
                    }
                    placeholder="https://example.com"
                    type="url"
                  />
                </div>
              </div>
              {/* Facebook */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="facebook_title">Facebook Title</Label>
                  <Input
                    id="facebook_title"
                    value={formData.facebook_title}
                    onChange={(e) =>
                      handleInputChange("facebook_title", e.target.value)
                    }
                    placeholder="Facebook Page"
                    type="text"
                  />
                </div>
                <div>
                  <Label htmlFor="facebook_url">Facebook URL</Label>
                  <Input
                    id="facebook_url"
                    value={formData.facebook_url}
                    onChange={(e) =>
                      handleInputChange("facebook_url", e.target.value)
                    }
                    placeholder="https://facebook.com/page"
                    type="url"
                  />
                </div>
              </div>
              {/* Instagram */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="instagram_title">Instagram Title</Label>
                  <Input
                    id="instagram_title"
                    value={formData.instagram_title}
                    onChange={(e) =>
                      handleInputChange("instagram_title", e.target.value)
                    }
                    placeholder="Instagram Page"
                    type="text"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram_url">Instagram URL</Label>
                  <Input
                    id="instagram_url"
                    value={formData.instagram_url}
                    onChange={(e) =>
                      handleInputChange("instagram_url", e.target.value)
                    }
                    placeholder="https://instagram.com/page"
                    type="url"
                  />
                </div>
              </div>

              {/* TikTok */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tiktok_title">TikTok Title</Label>
                  <Input
                    id="tiktok_title"
                    value={formData.tiktok_title}
                    onChange={(e) =>
                      handleInputChange("tiktok_title", e.target.value)
                    }
                    placeholder="TikTok Page"
                    type="text"
                  />
                </div>
                <div>
                  <Label htmlFor="tiktok_url">TikTok URL</Label>
                  <Input
                    id="tiktok_url"
                    value={formData.tiktok_url}
                    onChange={(e) =>
                      handleInputChange("tiktok_url", e.target.value)
                    }
                    placeholder="https://tiktok.com/@page"
                    type="url"
                  />
                </div>
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    value={formData.latitude}
                    onChange={(e) =>
                      handleInputChange("latitude", e.target.value)
                    }
                    placeholder="34.2500 or 34.2500, 36.0100"
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    value={formData.longitude}
                    onChange={(e) =>
                      handleInputChange("longitude", e.target.value)
                    }
                    placeholder="36.0100"
                    type="text"
                  />
                </div>
              </div>
              {/* Map */}
              <div
                ref={mapContainer}
                className="h-64 w-full mt-4 rounded-lg overflow-hidden shadow-md"
              />

              <div className="space-y-4">
                <Label>Places Images</Label>
                {placeImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {placeImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={
                            import.meta.env.VITE_SUPABASE_STORAGE_URL + image
                          }
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setImagestoDelete((prev) => [...prev, image]);
                            setPlaceImages((prev) =>
                              prev.filter((img) => img !== image)
                            );
                          }}
                          className="absolute top-2 right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {placeImages.length < 5 && (
                <div className="space-y-4">
                  <Label>Photos (up to 5)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-terracotta/50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload photos or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG, WebP up to 10MB each
                      </p>
                    </label>
                  </div>

                  {images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <Card className="bg-terracotta/5 border-terracotta/20">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-foreground mb-2">
                    Submission Guidelines
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                      • Ensure the place has historical or cultural significance
                    </li>
                    <li>• Provide clear, high-quality photos</li>
                    <li>• Include accurate location information</li>
                    <li>• Respect private property and local regulations</li>
                    <li>
                      • Do not submit places that could be dangerous to visit
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <div className="flex justify-end space-x-4">
                {/* <Button type="button" variant="outline">
                    Save as Draft
                  </Button> */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-terracotta hover:bg-terracotta/90"
                >
                  {isSubmitting ? "Submitting..." : "Edit Location"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
