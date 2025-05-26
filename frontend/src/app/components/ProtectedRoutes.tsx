// components/ProtectedRoute.tsx
'use client'

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoutes({ 
  children, 
  redirectTo = "/" 
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading
    
    if (!session) {
      router.push(redirectTo);
    }
  }, [session, status, router, redirectTo]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Don't render anything if not authenticated (redirect is happening)
  if (!session) {
    return null;
  }

  return <>{children}</>;
}