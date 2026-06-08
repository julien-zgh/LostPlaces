import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, MapPin, Plus, Shield, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useUserStore } from "@/lib/zustand/UserStore";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const {user} = useUserStore();
  const setUser = useUserStore((state) => state.setUser);

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        navigate("/login");
        localStorage.setItem("loggedIn", "false");
        setUser(null);
      } else {
        // Handle logout failure if needed
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const navigation = [
    { name: "Home", href: "/", icon: null },
    { name: "Explore Map", href: "/map", icon: MapPin },
    { name: "Add a Place", href: "/submit", icon: Plus },
    // ...(isLoggedIn ? [{ name: "Admin", href: "/admin", icon: Shield }] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-terracotta rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-serif font-semibold text-foreground">
              LostPlaces
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-1 px-3 py-2 text-md font-medium rounded-md transition-colors ${
                  isActive(item.href)
                    ? "text-terracotta bg-terracotta/10"
                    : "text-stone hover:text-terracotta hover:bg-terracotta/5"
                }`}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Avatar className="w-8 h-8">
                  {user.profile_pic ? (
                    <Link to="/dashboard" className="w-full">
                      <AvatarImage
                        src={`${user.profile_pic}?t=${Date.now()}`}
                      />
                    </Link>
                  ) : (
                    <Link to="/dashboard" className="w-full">
                      <AvatarFallback className="bg-terracotta text-white">
                        {user && user.firstName && user.lastName
                          ? `${user.firstName[0]?.toUpperCase() ?? ""}${
                              user.lastName[0]?.toUpperCase() ?? ""
                            }`
                          : "LU"}
                      </AvatarFallback>
                    </Link>
                  )}
                </Avatar>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="bg-terracotta hover:bg-terracotta/90"
                >
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-in-left">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? "text-terracotta bg-terracotta/10"
                      : "text-stone hover:text-terracotta hover:bg-terracotta/5"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span>{item.name}</span>
                </Link>
              ))}
              <div className="pt-4 border-t border-border">
                {user ? (
                  <>
                    <div className="flex justify-around">
                      <Avatar className="w-8 h-8">
                        {user.profile_pic ? (
                          <Link to="/dashboard" className="w-full">
                            <AvatarImage
                              src={`${user.profile_pic}?t=${Date.now()}`}
                            />
                          </Link>
                        ) : (
                          <Link to="/dashboard" className="w-full">
                            <AvatarFallback className="bg-terracotta text-white">
                              {user && user.firstName && user.lastName
                                ? `${user.firstName[0]?.toUpperCase() ?? ""}${
                                    user.lastName[0]?.toUpperCase() ?? ""
                                  }`
                                : "LU"}
                            </AvatarFallback>
                          </Link>
                        )}
                      </Avatar>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="text-red-500 hover:text-red-600"
                      >
                        <LogOut className="w-4 h-4 mr-1" />
                        Logout
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button
                      size="sm"
                      asChild
                      className="bg-terracotta hover:bg-terracotta/90"
                    >
                      <Link to="/register">Sign Up</Link>
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
