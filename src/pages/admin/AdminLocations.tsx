import { useEffect, useRef, useState } from "react";
import { Check, X, Eye, Trash2, Clock, MapPin, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useCategoriesStore } from "@/lib/zustand/CategoriesStore";
import UserName from "@/components/Username/username";
import SafeHtmlRenderer from "@/components/SafeHtmlRenderer/renderer";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { ConfirmModal } from "@/components/confirmModal/ConfirmModal";
import { useConfirmStore } from "@/components/confirmModal/useConfirmStore";
import GeneralModal from "@/components/Modal/GeneralModal";
import { Input } from "@/components/ui/input";
import { useEmailLoc } from "@/hooks/getEmailFromLoc";
import { ImageGallery } from "@/components/ImageGallery.tsx/ImageGallery";
import { Submission } from "@/lib/type";

export const AdminLocations = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const getCategoryName = useCategoriesStore((state) => state.getCategoryName);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [rejectedSubmission, setRejectedSubmission] =
    useState<Submission | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);

  const { fetchEmailFromLoc } = useEmailLoc();

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

  const fetchLocations = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/locations", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setSubmissions(data);
    } catch {
      toast.error("Error While fetching locations");
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const sendEmail = async (
    id: string,
    message: string,
    locationTitle: string
  ) => {
    try {
      const email = await fetchEmailFromLoc(id); // your function to get email

      const res = await fetch("http://localhost:3000/api/sendMail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, message, email, locationTitle }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error("Failed to send email");
      }

      toast.success("Explorer is notified");
    } catch {
      // console.error("Send email error:", err);
      toast.error("Notifying explorer was unsuccessful!");
    }
  };

  const handleApprove = async (id: string) => {
    const res = await fetch(`http://localhost:3000/api/location/accept/${id}`, {
      method: "POST",
    });
    if (!res.ok) {
      toast.error("Location could not be accepted");
      return;
    }
    fetchLocations();
    toast.success("Place approved and published!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "approved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const stats = {
    total: submissions.length,
    pending: submissions.filter((s) => s.status === "pending").length,
    approved: submissions.filter((s) => s.status === "approved").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <ConfirmModal />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
            Location Management
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage submitted places and moderate community contributions.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Places</p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.total}
                  </p>
                </div>
                <MapPin className="w-8 h-8 text-terracotta" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Pending Review
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.pending}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.approved}
                  </p>
                </div>
                <Check className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.rejected}
                  </p>
                </div>
                <X className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submissions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Place Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                <TabsTrigger value="pending">
                  Pending ({stats.pending})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Approved ({stats.approved})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejected ({stats.rejected})
                </TabsTrigger>
              </TabsList>

              {["all", "pending", "approved", "rejected"].map((tab) => (
                <TabsContent key={tab} value={tab} className="space-y-4">
                  {submissions &&
                    submissions
                      .filter((sub) => tab === "all" || sub.status === tab)
                      .map((submission) => (
                        <Card key={submission._id} className="border">
                          <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                              <div className="flex items-start space-x-4">
                                <img
                                  src={
                                    import.meta.env.VITE_SUPABASE_STORAGE_URL +
                                    submission.images[0]
                                  }
                                  alt={submission.title}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <h3 className="text-lg font-semibold text-foreground">
                                      {submission.title}
                                    </h3>
                                    <Badge
                                      className={`${getStatusColor(
                                        submission.status
                                      )} text-white`}
                                    >
                                      {submission.status}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-1">
                                    <MapPin className="w-4 h-4 inline mr-1" />
                                    {submission.location} •{" "}
                                    {getCategoryName(submission.category_id)}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Submitted by{" "}
                                    <UserName userId={submission.user_id} /> on{" "}
                                    {new Date(
                                      submission.createdAt
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedSubmission(submission);
                                        setIsDialogOpen(true);
                                      }}
                                    >
                                      <Eye className="w-4 h-4 mr-1" />
                                      View
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle>
                                        {selectedSubmission?.title}
                                      </DialogTitle>
                                    </DialogHeader>
                                    {selectedSubmission && (
                                      <div className="space-y-4">
                                        <ImageGallery
                                          selectedSubmission={
                                            selectedSubmission
                                          }
                                        />

                                        {selectedSubmission.status ===
                                          "rejected" && (
                                          <p className="text-sm text-red-600 border-2 rounded px-3 py-3">
                                            <b>Rejection Reason:</b> <br />{" "}
                                            {submission.rejection_reason}
                                          </p>
                                        )}

                                        <div>
                                          <h4 className="font-semibold mb-2">
                                            Description
                                          </h4>
                                          <div className="text-muted-foreground">
                                            <SafeHtmlRenderer
                                              html={
                                                selectedSubmission.description
                                              }
                                            />
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                          <div>
                                            <span className="font-semibold">
                                              Location:
                                            </span>
                                            <p>{selectedSubmission.location}</p>
                                          </div>
                                          <div>
                                            <span className="font-semibold">
                                              Category:
                                            </span>
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
                                            <p>
                                              <UserName
                                                userId={
                                                  selectedSubmission.user_id
                                                }
                                              />
                                            </p>
                                          </div>
                                          <div>
                                            <span className="font-semibold">
                                              Date:
                                            </span>
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

                                {submission.status === "pending" && (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        handleApprove(submission._id);
                                        sendEmail(
                                          submission.user_id,
                                          "Location has been accepted by our admin",
                                          submission.title
                                        );
                                      }}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <Check className="w-4 h-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() =>
                                        setRejectedSubmission(submission)
                                      }
                                    >
                                      <X className="w-4 h-4 mr-1" />
                                      Reject
                                    </Button>
                                  </>
                                )}

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
                                          `http://localhost:3000/api/location/delete/${submission._id}`,
                                          {
                                            method: "DELETE",
                                          }
                                        );
                                        if (!res.ok) {
                                          toast.error(
                                            "Location could not be deleted!"
                                          );
                                          return;
                                        }
                                        fetchLocations();
                                        toast.success(
                                          "Location deleted successfully!"
                                        );
                                      },
                                      reject: () => {},
                                    });
                                  }}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <GeneralModal
          isOpen={!!rejectedSubmission}
          onClose={() => setRejectedSubmission(null)}
        >
          <div className="p-4">
            <h2 className="mb-2">
              Why are you rejecting this submitted location?
            </h2>

            <Input
              type="text"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="mb-4"
            />

            <Button
              className="bg-red-600 hover:bg-red-700 w-full"
              onClick={async () => {
                if (!rejectionReason) {
                  toast.error("Please enter a rejection reason.");
                  return;
                }
                setIsRejecting(true);
                try {
                  const res = await fetch(
                    `http://localhost:3000/api/location/reject/${rejectedSubmission._id}`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ reason: rejectionReason }),
                    }
                  );

                  if (!res.ok) {
                    toast.error("Location could not be rejected!");
                    return;
                  }
                  const message = `We are unfortunate to tell you that your submitted location was rejected and the reason is: <span style="background-color: #ffe5e5;color: #b00000;padding: 2px 6px;border-radius: 4px;font-weight: bold;">${rejectionReason}</span>`;
                  sendEmail(
                    rejectedSubmission.user_id,
                    `${message}`,
                    rejectedSubmission.title
                  );
                  toast.success("Location rejected successfully!");
                  setRejectedSubmission(null);
                  setRejectionReason("");
                  fetchLocations();
                } catch {
                  // console.error(error);
                  toast.error("Error rejecting location.");
                }
                setIsRejecting(false);
              }}
              disabled={isRejecting}
            >
              {isRejecting ? "Rejecting.." : "Submit Rejection"}
            </Button>
          </div>
        </GeneralModal>
      </div>
    </div>
  );
};
