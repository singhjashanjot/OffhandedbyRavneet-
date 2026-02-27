import { getAdminUsers } from "@/lib/queries/admin";
import type { Metadata } from "next";

/* ========================================
   ADMIN — USERS MANAGEMENT
======================================== */

export const metadata: Metadata = {
  title: "Users | Offhanded Admin",
};

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-neutral-900">Users</h1>
        <p className="text-sm text-neutral-500 mt-1">{users.length} registered users</p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="text-left px-6 py-4 font-medium text-neutral-600">User</th>
              <th className="text-left px-6 py-4 font-medium text-neutral-600">Phone</th>
              <th className="text-left px-6 py-4 font-medium text-neutral-600">Role</th>
              <th className="text-left px-6 py-4 font-medium text-neutral-600">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {users.map((user: any) => (
              <tr key={user.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-medium text-neutral-900">{user.full_name || "No name"}</p>
                  <p className="text-xs text-neutral-400">{user.email}</p>
                </td>
                <td className="px-6 py-4 text-neutral-600">
                  {user.phone_number || "—"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                      user.role === "admin"
                        ? "bg-purple-50 text-purple-700"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {user.role || "USER"}
                  </span>
                </td>
                <td className="px-6 py-4 text-neutral-400 text-xs">
                  {new Date(user.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-neutral-400">
                  No users yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
