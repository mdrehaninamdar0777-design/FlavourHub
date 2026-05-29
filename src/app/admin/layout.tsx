"use client";
// ==========================================
// Admin Layout
// Middleware already blocked non-admins at the Edge.
// This layout adds a secondary client-side check
// as a belt-and-suspenders safety layer,
// and renders the sidebar.
// ==========================================
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading, firebaseUser } = useAuth();
  const router = useRouter();

  // Secondary client-side guard (middleware is the primary guard)
  // This catches edge cases like: session cookie expired mid-session
  useEffect(() => {
    if (!loading) {
      if (!firebaseUser) {
        // Not logged in — send to login
        router.replace("/auth/login?reason=auth_required&redirect=/admin/dashboard");
      } else if (!isAdmin) {
        // Logged in but not admin — send home
        router.replace("/?reason=admin_required");
      }
    }
  }, [isAdmin, loading, firebaseUser, router]);

  // Show spinner while auth state is loading
  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
          <p className="text-brand-muted text-sm font-body">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Render nothing while redirecting
  if (!firebaseUser || !isAdmin) return null;

  // Render admin panel
  return (
    <div className="flex min-h-screen bg-brand-dark">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
