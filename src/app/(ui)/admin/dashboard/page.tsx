"use client";

import useAuthCheck from "@/hooks/admin/useAuthCheck";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AdminMainLayout } from "@/layout/AdminMainLayout";

const salesData = [
  { name: "Jan", sales: 400 },
  { name: "Feb", sales: 300 },
  { name: "Mar", sales: 500 },
  { name: "Apr", sales: 700 },
  { name: "May", sales: 600 },
  { name: "Jun", sales: 800 },
];

export default function AdminDashboard() {
  const { user, loading } = useAuthCheck(); // Use the reusable hook

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    ); // Show a loading spinner while checking
  }

  if (!user) {
    return null; // Prevent rendering if no session (redirect is handled in the hook)
  }

  return (
    <AdminMainLayout>
      {/* Main Content */}
      <main className="flex-1 bg-gray-50 mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">₱120,000</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">1,245</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">320</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">540</p>
            </CardContent>
          </Card>
        </div>

        {/* Sales Chart */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Monthly Sales</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </AdminMainLayout>
  );
}
