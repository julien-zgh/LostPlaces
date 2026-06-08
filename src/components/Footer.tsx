import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-stone/10 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-terracotta rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl  font-semibold text-foreground">
                LostPlaces
              </span>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-md">
              Discover and preserve World's hidden historical places. A
              crowdsourced platform dedicated to documenting abandoned ruins,
              forgotten fortresses, and lost heritage sites.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-terracotta transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-terracotta transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-terracotta transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-terracotta transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/map"
                  className="text-muted-foreground hover:text-terracotta transition-colors"
                >
                  Explore Map
                </Link>
              </li>
              <li>
                <Link
                  to="/submit"
                  className="text-muted-foreground hover:text-terracotta transition-colors"
                >
                  Add a Place
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-terracotta transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className=" font-semibold text-foreground mb-4">
              Contact
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>info@lostplaces.com</span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+961 1 234 567</span>
              </li>
            </ul>
            <div className="mt-4">
              <Link
                to="/report"
                className="text-sm text-muted-foreground hover:text-terracotta transition-colors"
              >
                Report Abuse
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} LostPlaces. All rights reserved.
            Preserving World's heritage together.
          </p>
        </div>
      </div>
    </footer>
  );
};
