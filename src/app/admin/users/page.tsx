"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { formatDate } from "@/lib/utils";

interface UserRow { _id: string; name: string; email: string; role: string; image?: string; createdAt: string; }

export default function AdminUsersPage() {
  const { get } = useApi();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      try {
        const data = await get<{ success: boolean; data: UserRow[] }>("/api/users?admin=true&limit=50");
        if (data.success) setUsers(data.data);
      } catch {} finally { setLoading(false); }
    }
    fetch();
  }, [get]);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="font-heading font-bold text-brand-text text-2xl">Users</h1>
        <p className="text-brand-muted text-sm mt-1">{users.length} registered users</p>
      </div>
      {loading ? <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="glass-card p-5 h-16 skeleton" />)}</div> : (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-border">
                {["User","Email","Role","Joined"].map((h) => <th key={h} className="text-left px-4 py-3 text-brand-muted text-xs font-heading font-semibold uppercase">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <motion.tr key={user._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-brand-border/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-brand-orange to-brand-amber rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {user.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <span className="font-heading font-medium text-brand-text text-sm">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-brand-muted text-sm">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-lg capitalize ${user.role === "admin" ? "bg-brand-orange/20 text-brand-orange" : "bg-brand-border text-brand-muted"}`}>{user.role}</span>
                  </td>
                  <td className="px-4 py-3 text-brand-muted text-xs">{formatDate(user.createdAt)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="text-center py-16">
              <Users className="w-12 h-12 text-brand-border mx-auto mb-3" />
              <p className="text-brand-muted">No users found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}