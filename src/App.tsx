import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { MapPage } from "./pages/Map";
import { Submit } from "./pages/Submit";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Admin } from "./pages/Admin";
import { Dashboard } from "./pages/Dashboard";
import { PlaceDetail } from "./pages/PlaceDetail";
import { Terms } from "./pages/Terms";
import { Privacy } from "./pages/Privacy";
import { About } from "./pages/About";
import { Report } from "./pages/Report";
import { ForgotPassword } from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";

import { AdminLocations } from "./pages/admin/AdminLocations";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import RootLayout from "./layout";
import Profile from "./pages/Profile";
import { EditLocation } from "./pages/EditLocation";
import { Unauthorized } from "./pages/Unauthorized";
import { ResetPassword } from "./pages/ResetPassword";
import { Verify2FA } from "./pages/Verify2FA";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RootLayout>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="map" element={<MapPage />} />
                <Route
                  path="submit"
                  element={
                    <ProtectedRoute
                      allowedRoles={["explorer", "admin"]}
                      redirectTo={"/unauthorized"}
                    >
                      <Submit />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute
                      allowedRoles={["explorer"]}
                      redirectTo={"/login"}
                    >
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="dashboard/edit/:id"
                  element={
                    <ProtectedRoute
                      allowedRoles={["explorer"]}
                      redirectTo={"/unauthorized"}
                    >
                      <EditLocation />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <ProtectedRoute
                      allowedRoles={["user"]}
                      redirectTo={"/login"}
                    >
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route path="place/:id" element={<PlaceDetail />} />
                <Route
                  path="admin"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]} redirectTo={"/"}>
                      <Admin />
                    </ProtectedRoute>
                  }
                />
                <Route path="terms" element={<Terms />} />
                <Route path="privacy" element={<Privacy />} />
                <Route path="about" element={<About />} />
                <Route path="report" element={<Report />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="reset-password" element={<ResetPassword />} />
                <Route path="verify" element={<Verify2FA />} />
                <Route path="unauthorized" element={<Unauthorized />} />
                <Route
                  path="admin/locations"
                  element={
                    <ProtectedRoute
                      allowedRoles={["admin"]}
                      redirectTo={"/unauthorized"}
                    >
                      <AdminLocations />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="admin/users"
                  element={
                    <ProtectedRoute
                      allowedRoles={["admin"]}
                      redirectTo={"/unauthorized"}
                    >
                      <AdminUsers />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </RootLayout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
