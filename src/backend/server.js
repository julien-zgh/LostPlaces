import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import session from "express-session";

//API Routes
import Register from "./Auth/Register.js";
import Login from "./Auth/Login.js";
import Profile from "./Auth/Profile.js";
import Logout from "./Auth/Logout.js";
import ForgotPassword from "./Auth/ForgotPassword.js";
import VerifyResetToken from "./Auth/VerifyResetToken.js";
import ResetPassword from "./Auth/ResetPassword.js";
import FetchCategories from "./API/fetchCategories.js";
import UploadPlace from "./API/Locations/UploadPlace.js";
import FetchPlaces from "./API/Locations/FetchPlaces.js";
import FetchStats from "./API/fetchStats.js";
import FetchUsers from "./API/Explorer/fetchUsers.js";
import DeleteUser from "./API/Explorer/deleteUser.js";
import FetchLocationsAsAdmin from "./API/Locations/fetchLocationAsAdmin.js";
import FetchUsername from "./API/Explorer/fetchUsername.js";
import DeleteLocation from "./API/Locations/deleteLocation.js";
import RejectLocation from "./API/Locations/rejectLocation.js";
import AcceptLocation from "./API/Locations/acceptLocation.js";
import ReportLocation from "./API/Locations/reportLocation.js";
import LocationRating from "./API/Locations/locationRating.js";
import RateLocation from "./API/Locations/rateLocation.js";
import GetUserRole from "./API/Explorer/getUserRole.js";
import GetUserMail from "./API/Explorer/getUserEmail.js";
import SendMail from "./API/Mails/sendMail.js";
import FetchUserInfo from "./API/Explorer/fetchUserInfo.js";
import UpdateExplorerProfile from "./API/Explorer/updateProfile.js";
import FetchPlaceDetails from "./API/Locations/fetchPlaceDetails.js";
import UpdateLocationDetails from "./API/Locations/updateLocationDetails.js";
import FetchMapLocations from "./API/Locations/fetchMapLocations.js";
import FetchLocationDetails from "./API/Locations/fetchLocationDetails.js";
import FetchExplorerProfile from "./API/Explorer/fetchExplorerProfile.js";
import FetchLocationRatings from "./API/Locations/fetchLocationRatings.js";
import FetchMostRatedLocations from "./API/Locations/fetchMostRatedLocations.js";
import SaveLocation from "./API/Locations/saveLocation.js";
import RemoveLocation from "./API/Locations/removeLocation.js"
import IsLocationBookmarked from "./API/Locations/isLocationBookmarked.js";
import FetchNearbyLocations from "./API/Locations/fetchNearbyLocations.js";
import MarkLocationVisited from "./API/Locations/markLocationVisited.js";
import IsLocationVisited from "./API/Locations/isLocationVisited.js";
import UnmarkLocation from "./API/Locations/unmarkLocation.js";
import FetchSavedLocations from "./API/Locations/fetchSavedLocations.js";
import FetchVisitedLocations from "./API/Locations/fetchVisitedLocations.js";
import FetchLengths from "./API/Locations/fetchLengths.js";
import FetchReviewedLocations from "./API/Locations/fetchReviewedLocations.js";
import Generate2FA from "./Auth/Generate2FA.js";
import Verify2FA from "./Auth/Verify2FA.js";
import Validate2FA from "./Auth/Validate2FA.js";
// import InsertCategories from "./API/InsertCategories.js"

// Load env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Enable debug logs
mongoose.set("debug", true);

// Configure CORS
const corsOptions = {
  origin: "http://localhost:8080", // Frontend URL (update as needed)
  credentials: true, // Allow cookies to be sent from the frontend
};
app.use(cors(corsOptions)); // Use CORS with the configured options

app.use(bodyParser.json()); //middleware that parses the incoming request.body before your route handlers access it

// Configure Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

//Configure App with Routes
app.use("/api/auth/register", Register);
app.use("/api/auth/login", Login);
app.use("/api/auth/logout", Logout);
app.use("/api/auth/forgot-password", ForgotPassword);
app.use("/api/auth/verify-reset-token", VerifyResetToken);
app.use("/api/auth/reset-password", ResetPassword);
app.use("/api/auth/2fa/generate", Generate2FA);
app.use("/api/auth/2fa/verify", Verify2FA);
app.use("/api/auth/validate-2fa", Validate2FA);
app.use("/api/profile", Profile);
app.use("/api/categories", FetchCategories);
app.use("/api/upload", UploadPlace);
app.use("/api/fetchPlaces", FetchPlaces);
app.use("/api/stats", FetchStats);
app.use("/api/users", FetchUsers);
app.use("/api/delete/user", DeleteUser);
app.use("/api/locations", FetchLocationsAsAdmin);
app.use("/api/user", FetchUsername);
app.use("/api/location/delete", DeleteLocation);
app.use("/api/location/reject", RejectLocation);
app.use("/api/location/accept", AcceptLocation);
app.use("/api/location/report", ReportLocation);
app.use("/api/location/rate", RateLocation);
app.use("/api/location/rating", LocationRating);
app.use("/api/fetchLocationRatings", FetchLocationRatings);
app.use("/api/fetchMostRatedLocations", FetchMostRatedLocations);
app.use("/api/fetchUserRole", GetUserRole);
app.use("/api/fetchUserEmail", GetUserMail);
app.use("/api/sendMail", SendMail);
app.use("/api/fetchUserInfo", FetchUserInfo);
app.use("/api/updateUserProfile", UpdateExplorerProfile);
app.use("/api/fetchPlaceDetails", FetchPlaceDetails);
app.use("/api/location/update", UpdateLocationDetails);
app.use("/api/fetchMapLocations", FetchMapLocations);
app.use("/api/location/fetchLocationDetails", FetchLocationDetails);
app.use("/api/fetchExplorerProfile", FetchExplorerProfile);
app.use("/api/location/saveLocation", SaveLocation);
app.use("/api/location/removeLocation", RemoveLocation);
app.use("/api/location/bookmarked", IsLocationBookmarked);
app.use("/api/location/fetchNearbyLocations", FetchNearbyLocations);
app.use("/api/location/markVisited", MarkLocationVisited);
app.use("/api/location/visited", IsLocationVisited);
app.use("/api/location/unmarkLocation", UnmarkLocation);
app.use("/api/location/fetchSavedLocations", FetchSavedLocations);
app.use("/api/location/fetchVisitedLocations", FetchVisitedLocations);
app.use("/api/location/fetchLengths", FetchLengths);
app.use("/api/location/fetchReviewedLocations", FetchReviewedLocations);
// app.use("/api/categories", InsertCategories);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`
++------------------------------------------------++
++------------------------------------------------++
||  ____                            _           _ ||
|| / ___|___  _ __  _ __   ___  ___| |_ ___  __| ||
|| |   / _ \\| '_ \\| '_ \\ / _ \\/ __| __/ _ \\/ _\` ||
|| |__| (_) | | | | | | |  __/ (__| ||  __/ (_| ||
|| \\____\\___/|_| |_|_| |_|\\___|\\___|\\__\\___|\\__,_||
||                                                ||
++------------------------------------------------++
++------------------------------------------------++

Server Connected on Port ${PORT}
`);
    });
  })
  .catch((err) => console.log("MongoDB connection error:", err));
