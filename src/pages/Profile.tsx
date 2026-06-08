import { useEffect, useState } from "react";
import { User, MapPin, Edit, Eye, X, Star, StarHalf, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

import "yet-another-react-lightbox/styles.css";
import { useUserStore } from "@/lib/zustand/UserStore";
import { useCategoriesStore } from "@/lib/zustand/CategoriesStore";
import DynamicImage from "@/components/DynamicImage/DynamicImage";
import "maplibre-gl/dist/maplibre-gl.css";
import { ConfirmModal } from "@/components/confirmModal/ConfirmModal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import supabase from "../backend/supabaseClient";
import { Loading } from "@/components/Loading";
import {
  LoggedUser,
  Rating,
  VisitedItem,
  WhishlistItem,
} from "@/lib/type";
import { Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import TwoFactor from "@/components/TwoFactor";

const Profile = () => {
  const [places, setPlaces] = useState<
    WhishlistItem[] | VisitedItem[] | Rating[]
  >([]);
  const [lengths, setLenghts] = useState<{
    whishlist_count: number;
    visited_count: number;
    ratings_count: number;
  }>({
    whishlist_count: 0,
    visited_count: 0,
    ratings_count: 0,
  });
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const userFromStore = useUserStore((state) => state.user);
  const [user, setUser] = useState(null);
  const setUserInStore = useUserStore((state) => state.setUser);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState<LoggedUser>(null);
  const [newProfilePic, setNewProfilePic] = useState<File | null>(null);

  const [updatingUser, setUpdatingUser] = useState(false);
  const [stars, setStars] = useState<Rating[]>([]);

  const [locType, setLocType] = useState<"saved" | "visited" | "reviewed">(
    "saved"
  );

  const fetchLength = async () => {
    const res = await fetch(
      `http://localhost:3000/api/location/fetchLengths/${userFromStore._id}`
    );
    if (!res.ok) {
      toast.error("Failed to fetch lengths");
      return;
    }
    const len = await res.json();
    setLenghts(len);
  };

  const fetchLocations = async () => {
    setLoadingPlaces(true);
    let LocationsRes;
    setPlaces([]);
    //fetch saved locations
    if (locType === "saved") {
      LocationsRes = await fetch(
        `http://localhost:3000/api/location/fetchSavedLocations/${userFromStore._id}`
      );
    } else if (locType === "visited") {
      LocationsRes = await fetch(
        `http://localhost:3000/api/location/fetchVisitedLocations/${userFromStore._id}`
      );
    } else if (locType === "reviewed") {
      LocationsRes = await fetch(
        `http://localhost:3000/api/location/fetchReviewedLocations/${userFromStore._id}`
      );
    }

    if (!LocationsRes.ok) {
      toast.error("Failed to fetch places");
      return;
    }
    const locationsData: WhishlistItem[] | VisitedItem[] | Rating[] =
      await LocationsRes.json();
    if (locType === "reviewed") setStars(locationsData as Rating[]);

    for (const loc of locationsData) {
      const res = await fetch(
        `http://localhost:3000/api/location/fetchLocationDetails/${loc.placeId} `
      );
      if (!res.ok) {
        toast.error("Failed to fetch locations details");
        return;
      }
      const data = await res.json();
      setPlaces((prev) => [...prev, data]);
    }
    setLoadingPlaces(false);
  };

  const fetchUserDetails = async () => {
    const res = await fetch(
      `http://localhost:3000/api/fetchUserInfo/${userFromStore._id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      toast.error("Failed to fetch user info");
      return;
    }
    const data = await res.json();
    // console.log(data);
    setUser(data);
    setUserInStore(data);
    setEditedProfile(data);
  };

  useEffect(() => {
    fetchUserDetails();
    fetchLength();
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [locType]);

  const handleSaveProfile = async () => {
    setUpdatingUser(true);
    try {
      let newProfilePicUrl = editedProfile.profile_pic;

      // If a new image is selected
      if (newProfilePic) {
        // Delete old profile picture if exists
        if (user.profile_pic) {
          const oldPath = user.profile_pic.split(
            `${import.meta.env.VITE_SUPABASE_STORAGE_URL}`
          )[1]; // extract path after base URL

          const { error: deleteError } = await supabase.storage
            .from("lostplaces")
            .remove([oldPath]);

          if (deleteError) {
            // console.error("Error deleting old image:", deleteError.message);
            toast.error("Failed to delete old profile picture!");
            return;
          }
        }

        // Upload the new image
        const fileExt = newProfilePic.name.split(".").pop();
        const fileName = `${userFromStore._id}_${Date.now()}.${fileExt}`;
        const filePath = `ProfilePics/${userFromStore._id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("lostplaces")
          .upload(filePath, newProfilePic);

        if (uploadError) {
          // console.error("Error uploading new image:", uploadError.message);
          toast.error("Failed to upload new profile picture!");
          return;
        }

        // Get the public URL of the uploaded image
        const { data: publicUrlData } = supabase.storage
          .from("lostplaces")
          .getPublicUrl(filePath);

        newProfilePicUrl = publicUrlData.publicUrl;
      }

      editedProfile.profile_pic = newProfilePicUrl;

      // Update profile in backend
      const res = await fetch(`http://localhost:3000/api/updateUserProfile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedProfile),
      });

      if (!res.ok) {
        toast.error("Failed to update profile!");
        return;
      }

      // Update state
      fetchUserDetails();
      setNewProfilePic(null); // reset image file
      setIsEditingProfile(false);

      toast.success("Profile updated successfully!");
    } catch (error) {
      // console.error("Profile save error:", error);
      toast.error("An error occurred while saving your profile!");
    }
    setUpdatingUser(false);
  };

  const handleCancelEdit = () => {
    setEditedProfile(user);
    setIsEditingProfile(false);
  };

  // At the top of Dashboard return
  if (!user || !places) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <ConfirmModal />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-2">
            Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your account and submitted places
          </p>
        </div>

        {/* Account Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-terracotta" />
                <span>Account Information</span>
              </div>
              {!isEditingProfile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingProfile(true)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit Profile
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditingProfile ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  <Avatar className="w-20 h-20">
                    {user.profile_pic ? (
                      <AvatarImage src={user.profile_pic} />
                    ) : (
                      <AvatarFallback className="bg-terracotta text-white">{`${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`}</AvatarFallback>
                    )}
                  </Avatar>

                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="first_name">First Name</Label>
                        <Input
                          id="first_name"
                          value={editedProfile.firstName}
                          onChange={(e) =>
                            setEditedProfile((prev) => ({
                              ...prev,
                              firstName: e.target.value,
                            }))
                          }
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input
                          id="last_name"
                          value={editedProfile.lastName}
                          onChange={(e) =>
                            setEditedProfile((prev) => ({
                              ...prev,
                              lastName: e.target.value,
                            }))
                          }
                          placeholder="Enter your last name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editedProfile.email}
                          onChange={(e) =>
                            setEditedProfile((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          placeholder="Enter your email"
                        />
                      </div>
                      <div>
                        <Label htmlFor="profile_picture">Profile Picture</Label>
                        <Input
                          id="profile_picture"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setNewProfilePic(file);
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button onClick={handleSaveProfile} size="sm">
                        <Save className="w-4 h-4 mr-1" />
                        {updatingUser ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancelEdit}
                        size="sm"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <Avatar className="w-20 h-20">
                  {user.profile_pic ? (
                    <AvatarImage src={user.profile_pic} />
                  ) : (
                    <AvatarFallback className="bg-terracotta text-white">{`${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`}</AvatarFallback>
                  )}
                </Avatar>

                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-1">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-muted-foreground mb-3">{user.email}</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Member since{" "}
                    {new Date(user.joinDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-terracotta">
                        {lengths.whishlist_count}
                      </div>
                      <div className="text-sm text-muted-foreground">Saved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {lengths.visited_count}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Visited
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-500">
                        {lengths.ratings_count}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Reviewed
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <TwoFactor isEnabled={user.twoFA.enabled} id={user._id}/>

        {/* Places Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-terracotta" />
              <span>My Submitted Places</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="saved"
              onValueChange={(val) => {
                // console.log(val);
                setLocType(val as "saved" | "visited" | "reviewed");
              }}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="saved">
                  Saved ({lengths.whishlist_count})
                </TabsTrigger>
                <TabsTrigger value="visited">
                  Visited ({lengths.visited_count})
                </TabsTrigger>
                <TabsTrigger value="reviewed">
                  Reviewed ({lengths.ratings_count})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="saved">
                <PlacesTable places={places} loading={loadingPlaces} />
              </TabsContent>

              <TabsContent value="visited">
                <PlacesTable places={places} loading={loadingPlaces} />
              </TabsContent>

              <TabsContent value="reviewed">
                <PlacesTable
                  places={places}
                  stars={stars}
                  loading={loadingPlaces}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;

interface PlacesTableProps {
  places: WhishlistItem[] | VisitedItem[] | Rating[];
  stars?: Rating[];
  loading?: boolean;
}

const PlacesTable = ({
  places,
  stars,
  loading,
}: PlacesTableProps) => {
  const categories = useCategoriesStore((state) => state.categories);
  const getCategoryName = useCategoriesStore((state) => state.getCategoryName);
  const navigate = useNavigate();

  if (loading) {
    // Show skeleton rows while loading
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Place</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
              {stars && <TableHead>Rating</TableHead>}
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Skeleton
                      variant="rectangular"
                      width={48}
                      height={48}
                      className="rounded-lg"
                    />
                    <Skeleton variant="text" width={120} height={24} />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={80} height={24} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={100} height={24} />
                </TableCell>
                {stars && (
                  <TableCell>
                    <Skeleton variant="text" width={80} height={24} />
                  </TableCell>
                )}
                <TableCell>
                  <Skeleton variant="rectangular" width={60} height={36} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (places.length === 0) {
    return (
      <div className="text-center py-8">
        <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">
          No places found in this category
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Place</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Location</TableHead>
            {stars && <TableHead>Rating</TableHead>}
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {places.map((place) => {
            return (
              <TableRow key={place._id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <DynamicImage
                      src={
                        import.meta.env.VITE_SUPABASE_STORAGE_URL +
                        place.images[0]
                      }
                      alt={place.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-medium">{place.title}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {categories.find((cat) => cat._id === place.category_id)
                      ?.category || "Unknown"}
                  </Badge>
                </TableCell>

                <TableCell className="text-sm text-muted-foreground">
                  {place.location}
                </TableCell>

                {stars && (
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      {(() => {
                        const rating =
                          stars.find((star) => star.placeId === place._id)
                            ?.rating ?? 0;
                        const fullStars = Math.floor(rating);
                        const halfStar = rating % 1 >= 0.5;
                        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

                        return (
                          <>
                            {/* Full Stars */}
                            {Array.from({ length: fullStars }).map((_, i) => (
                              <Star
                                key={`full-${i}`}
                                className="w-4 h-4 text-yellow-400"
                              />
                            ))}

                            {/* Half Star */}
                            {halfStar && (
                              <StarHalf className="w-4 h-4 text-yellow-400" />
                            )}

                            {/* Empty Stars */}
                            {Array.from({ length: emptyStars }).map((_, i) => (
                              <Star
                                key={`empty-${i}`}
                                className="w-4 h-4 text-gray-300"
                              />
                            ))}
                          </>
                        );
                      })()}
                    </div>
                  </TableCell>
                )}

                <TableCell>
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigate(`/place/${place._id}`);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
