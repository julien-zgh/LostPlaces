import { useEffect, useRef, useState } from "react";
import {
  User,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Eye,
  Trash2,
  Save,
  X,
} from "lucide-react";
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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SafeHtmlRenderer from "@/components/SafeHtmlRenderer/renderer";
import { LoggedUser } from "@/lib/type";
import { useUserStore } from "@/lib/zustand/UserStore";
import { useCategoriesStore } from "@/lib/zustand/CategoriesStore";
import DynamicImage from "@/components/DynamicImage/DynamicImage";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useConfirmStore } from "@/components/confirmModal/useConfirmStore";
import { ConfirmModal } from "@/components/confirmModal/ConfirmModal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import supabase from "../backend/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Loading } from "@/components/Loading";
import { Place } from "@/lib/type";
import { ImageGallery } from "@/components/ImageGallery.tsx/ImageGallery";
import TwoFactor from "@/components/TwoFactor";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "approved":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Approved
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          Pending
        </Badge>
      );
    case "rejected":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          Rejected
        </Badge>
      );
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "approved":
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case "pending":
      return <Clock className="w-4 h-4 text-yellow-600" />;
    case "rejected":
      return <XCircle className="w-4 h-4 text-red-600" />;
    default:
      return null;
  }
};

export const Dashboard = () => {
  const [places, setPlaces] = useState([]);
  const userFromStore = useUserStore((state) => state.user);
  const [user, setUser] = useState(null);

  const setUserInStore = useUserStore((state) => state.setUser);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState<LoggedUser>(null);
  const [newProfilePic, setNewProfilePic] = useState<File | null>(null);

  const [updatingUser, setUpdatingUser] = useState(false);

  const fetchLocations = async () => {
    const LocationsRes = await fetch(
      `http://localhost:3000/api/fetchPlaces?user_id=${userFromStore._id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!LocationsRes.ok) {
      toast.error("Failed to fetch places");
      return;
    }
    const locationsData = await LocationsRes.json();
    setPlaces(locationsData.places);
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
    setUser(data);
    // console.log(data)
    setUserInStore(data);
    setEditedProfile(data);
  };

  useEffect(() => {
    fetchUserDetails();
    fetchLocations();
    console.log(user);
  }, []);

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

  const approvedPlaces = places.filter((place) => place.status === "approved");
  const pendingPlaces = places.filter((place) => place.status === "pending");
  const rejectedPlaces = places.filter((place) => place.status === "rejected");

  // At the top of Dashboard return
  if (!user) {
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
                      <AvatarFallback className="bg-terracotta text-white">
                        {`${user.firstName?.[0]?.toUpperCase() || ""}${
                          user.lastName?.[0]?.toUpperCase() || ""
                        }`}
                      </AvatarFallback>
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
                    <AvatarFallback className="bg-terracotta text-white">
                      {`${user.firstName?.[0]?.toUpperCase() || ""}${
                        user.lastName?.[0]?.toUpperCase() || ""
                      }`}
                    </AvatarFallback>
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

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-terracotta">
                        {(user.approved ?? 0) +
                          (user.pending ?? 0) +
                          (user.rejected ?? 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Submissions
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {user.approved}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Approved
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {user.pending}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Pending
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {user.rejected}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Rejected
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
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="all">
                  All ( {user.approved + user.rejected + user.pending})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Approved ({user.approved})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending ({user.pending})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejected ({user.rejected})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <PlacesTable
                  places={places}
                  fetchLocations={fetchLocations}
                  fetchUserDetails={fetchUserDetails}
                />
              </TabsContent>

              <TabsContent value="approved">
                <PlacesTable
                  places={approvedPlaces}
                  fetchLocations={fetchLocations}
                  fetchUserDetails={fetchUserDetails}
                />
              </TabsContent>

              <TabsContent value="pending">
                <PlacesTable
                  places={pendingPlaces}
                  fetchLocations={fetchLocations}
                  fetchUserDetails={fetchUserDetails}
                />
              </TabsContent>

              <TabsContent value="rejected">
                <PlacesTable
                  places={rejectedPlaces}
                  fetchLocations={fetchLocations}
                  fetchUserDetails={fetchUserDetails}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface PlacesTableProps {
  places: Place[];
  fetchLocations: () => void;
  fetchUserDetails: () => void;
}

const PlacesTable = ({
  places,
  fetchLocations,
  fetchUserDetails,
}: PlacesTableProps) => {
  const categories = useCategoriesStore((state) => state.categories);
  const getCategoryName = useCategoriesStore((state) => state.getCategoryName);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Place | null>(
    null
  );

  const navigate = useNavigate();

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);

  // Initialize map & marker once
  useEffect(() => {
    if (!selectedSubmission || !isDialogOpen) return;

    // Use a timeout to ensure the DOM is ready
    const initMap = () => {
      if (!mapContainer.current) return;

      // destroy previous map if exists
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      if (marker.current) {
        marker.current.remove();
        marker.current = null;
      }

      try {
        // create new map
        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style:
            "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
          center: [selectedSubmission.coords[1], selectedSubmission.coords[0]],
          zoom: 15,
        });

        map.current.setMaxZoom(17.5);

        marker.current = new maplibregl.Marker({
          color: "#cb774a",
          draggable: false,
        })
          .setLngLat([
            selectedSubmission.coords[1],
            selectedSubmission.coords[0],
          ])
          .addTo(map.current);
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    // Small delay to ensure DOM is rendered
    const timeoutId = setTimeout(initMap, 100);

    return () => {
      clearTimeout(timeoutId);
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      if (marker.current) {
        marker.current.remove();
        marker.current = null;
      }
    };
  }, [selectedSubmission, isDialogOpen]);

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
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {places.map((place) => (
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
                    {place.status === "rejected" && place.rejection_reason && (
                      <div className="text-sm text-red-600 mt-1">
                        Reason: {place.rejection_reason}
                      </div>
                    )}
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
              <TableCell>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(place.status)}
                  {getStatusBadge(place.status)}
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(place.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Dialog
                    modal={true}
                    open={isDialogOpen}
                    onOpenChange={(open) => setIsDialogOpen(open)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSubmission(place);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{selectedSubmission?.title}</DialogTitle>
                      </DialogHeader>
                      {selectedSubmission && (
                        <div className="space-y-4">
                          <ImageGallery
                            selectedSubmission={selectedSubmission}
                          />

                          {selectedSubmission.status === "rejected" && (
                            <p className="text-sm text-red-600 border-2 rounded px-3 py-3">
                              <b>Rejection Reason:</b> <br />{" "}
                              {selectedSubmission.rejection_reason}
                            </p>
                          )}

                          <div>
                            <h4 className="font-semibold mb-2">Description</h4>
                            <div className="text-muted-foreground">
                              <SafeHtmlRenderer
                                html={selectedSubmission.description}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-semibold">Location:</span>
                              <p>{selectedSubmission.location}</p>
                            </div>
                            <div>
                              <span className="font-semibold">Category:</span>
                              <p>
                                {getCategoryName(
                                  selectedSubmission.category_id
                                )}
                              </p>
                            </div>
                            <div>
                              <span className="font-semibold">
                                Submitted by:
                              </span>
                            </div>
                            <div>
                              <span className="font-semibold">Date:</span>
                              <p>
                                {new Date(
                                  selectedSubmission.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div
                            ref={mapContainer}
                            className="h-64 w-full mt-4 rounded-lg overflow-hidden shadow-md"
                          />
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  {/* Edit Button */}
                  {place.status !== "rejected" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigate(`/dashboard/edit/${place._id}`);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}

                  {/* Delete Button */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      useConfirmStore.getState().show({
                        title: "Delete Location?",
                        message:
                          "Are you sure you want to delete this location?",
                        confirmText: "Delete",
                        cancelText: "Cancel",
                        resolve: async () => {
                          const res = await fetch(
                            `http://localhost:3000/api/location/delete/${place._id}`,
                            {
                              method: "DELETE",
                            }
                          );
                          if (!res.ok) {
                            toast.error("Location could not be deleted!");
                            return;
                          }
                          fetchLocations();
                          fetchUserDetails();
                          toast.success("Location deleted successfully!");
                        },
                        reject: () => {},
                      });
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
