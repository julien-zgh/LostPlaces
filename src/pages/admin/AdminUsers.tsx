import { useEffect, useState } from "react";
import { Users, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const usersLength = users.length;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        setUsers(data);
        // console.log(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/delete/user/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers((prev) => prev.filter((user) => user._id !== id)); // Make sure the ID matches the actual property
      toast.success("User deleted permanently.");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete user.");
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
            User Management
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage registered users and their account status.
          </p>
        </div>

        {/* Users List */}
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <div className="flex flex-col">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Registered Users
              </CardTitle>
            </div>
            <div className="flex flex-col items-end border-2 p-2 rounded-xl">
              <span className="text-md font-bold">
                {usersLength} user{usersLength === 1 ? "" : "s"}
              </span>
            </div>
          </CardHeader>

          <CardContent>
            {users.length === 0 ? (
              <>
                <div className="space-y-4">
                  <Card className="border p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Users className="w-5 h-5" />
                      <span>No Users Found!</span>
                    </div>
                  </Card>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  {users.map((user, index) => (
                    <Card key={index} className="border">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                              <Users className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-lg font-semibold text-foreground capitalize">
                                  {`${user.firstName} ${user.lastName}`}
                                </h3>
                                <div
                                  className={`
    inline-flex items-center px-3 py-1
    rounded-full font-medium text-sm
    text-white capitalize
    transition-colors duration-200
    ${
      user.role === "explorer"
        ? "bg-red-600 hover:bg-red-700"
        : "bg-green-600 hover:bg-green-700"
    }
  `}
                                >
                                  {user.role}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">
                                {user.email}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Joined on{" "}
                                {new Date(user.joinDate).toLocaleDateString()} •{" "}
                                {user.approved + user.pending + user.rejected}{" "}
                                submissions
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteUser(user._id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <UserX className="w-4 h-4 mr-1" />
                              Delete User
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
