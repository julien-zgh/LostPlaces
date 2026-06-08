import { Link } from "react-router-dom";
import { Users, MapPin, Settings, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export const Admin = () => {
  const [users, setUsers] = useState<number>(0);
  const [locations, setLocations] = useState<number>(0);
  const [pendingLocations, setPendingLocations] = useState<number>(0);
  const [monthlyVisits, setMonthlyVisits] = useState<number>(0);

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/stats", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch stats");

        const data = await res.json();

        setUsers(data.users || 0);
        setLocations(data.locations || 0);
        setPendingLocations(data.pendingLocations || 0);
        setMonthlyVisits(data.monthlyVisits || 0);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    getStats();
  }, []);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
            Admin Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Central hub for managing the platform and community.
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/admin/locations">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-terracotta/10 rounded-lg">
                    <MapPin className="w-6 h-6 text-terracotta" />
                  </div>
                  Location Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Review, approve, and manage submitted places and historical
                  sites.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Manage submissions
                  </span>
                  <Button variant="outline" size="sm">
                    View Details →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/users">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Manage registered users, their permissions, and account
                  status.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Manage users
                  </span>
                  <Button variant="outline" size="sm">
                    View Details →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Quick Stats Overview */}
        <div className="mt-12">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
            Platform Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Places
                    </p>
                    <p className="text-2xl font-bold text-foreground">{locations}</p>
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
                      Active Users
                    </p>
                    <p className="text-2xl font-bold text-green-600">{users}</p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Pending Reviews
                    </p>
                    <p className="text-2xl font-bold text-yellow-600">{pendingLocations}</p>
                  </div>
                  <Settings className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            {/* <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Monthly Visits
                    </p>
                    <p className="text-2xl font-bold text-purple-600">{monthlyVisits}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </div>
  );
};
