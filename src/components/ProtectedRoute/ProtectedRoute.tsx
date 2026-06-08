"use client";

import { useUserStore } from "@/lib/zustand/UserStore";
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// console.log("ProtectedRoute module loaded"); // Should always appear on page load

type ProtectedRouteProps = {
  children: ReactNode;
  redirectTo?: string | -1;
  requireAuth?: boolean;
  allowedRoles?: string[];
  loadingComponent?: ReactNode;
};

export function ProtectedRoute({
  children,
  redirectTo,
  requireAuth = true,
  allowedRoles,
  loadingComponent = (
    <div className="w-full h-screen flex justify-center items-center bg-white">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent border-primary-600" />
      <span className="ml-4 text-primary-700 font-semibold">Loading...</span>
    </div>
  ),
}: ProtectedRouteProps) {
  const currentUser = useUserStore((state) => state.user);

  // console.log("ProtectedRoute rendered");
  // console.log("currentUser value:", currentUser);

  const role = currentUser?.role;
  const navigate = useNavigate();

  const hasAllowedRole = allowedRoles?.length
    ? allowedRoles.includes(role ?? "")
    : true;

  useEffect(() => {
    // console.log("useEffect triggered with currentUser:", currentUser);

    if (requireAuth && !currentUser) {
      if (redirectTo === -1) navigate(-1);
      else if (typeof redirectTo === "string")
        navigate(redirectTo, { replace: true });
      else navigate("/login", { replace: true });
      return;
    }

    if (currentUser && !hasAllowedRole) {
      if (redirectTo === -1) navigate(-1);
      else if (typeof redirectTo === "string")
        navigate(redirectTo, { replace: true });
      else navigate("/", { replace: true });
      return;
    }
  }, [currentUser, hasAllowedRole, requireAuth, redirectTo, navigate]);

  if (currentUser === undefined) return <>{loadingComponent}</>;

  if (requireAuth && !currentUser) return null;

  if (currentUser && !hasAllowedRole) return null;

  return <>{children}</>;
}
