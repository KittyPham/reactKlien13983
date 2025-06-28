import React from "react";
import ReactDOM from "react-dom/client";
import { Navigate, createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "@/App.css";

import { AuthProvider } from "@/Utils/Contexts/AuthContext";

import AuthLayout from "@/Layouts/AuthLayout";
import AdminLayout from "@/Layouts/AdminLayout";
import ProtectedRoute from "@/Components/ProtectedRoute";

import Login from "@/Pages/Auth/Login";
import Dashboard from "@/Pages/Admin/Dashboard/Dashboard";
import Mahasiswa from "@/Pages/Admin/Mahasiswa/Mahasiswa";
import MahasiswaDetail from "@/Pages/Admin/MahasiswaDetail/MahasiswaDetail";
import PageNotFound from "@/Pages/PageNotFound";
import RencanaStudi from "@/Pages/Admin/RencanaStudi/RencanaStudi";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {},
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "mahasiswa",
        children: [
          {
            index: true,
            element: <Mahasiswa />,
          },
          {
            path: ":nim",
            element: <MahasiswaDetail />,
          },
        ],
      },
      {
        path: "rencana-studi",
        element: <RencanaStudi />,
      },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

// DIUBAH: Bungkus aplikasi dengan QueryClientProvider
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <RouterProvider router={router} />
      </AuthProvider>
      {/* BARU: Tambahkan Devtools untuk debugging */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
