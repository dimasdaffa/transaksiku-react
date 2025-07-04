import { createBrowserRouter } from "react-router-dom";
import Login from "../Pages/Auth/Login";
import AdminLayout from "../Layouts/AdminLayout";
import TransferPage from "../Pages/Transfer/TransferPage";
import DashboardPage from "../Pages/Admin/Dashboard/DashboardPage";
import RekeningPage from "../Pages/Admin/Rekening/RekeningPage";
import LaporanPage from "../Pages/Admin/Laporan/LaporanPage";
import SettingsPage from "../Pages/Admin/Settings/SettingsPage";
import ProtectedRoute from "../Routes/ProtectedRoute";

const Router = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
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
                element: <DashboardPage />,
            },
            {
                path: "dashboard",
                element: <DashboardPage />,
            },
            {
                path: "rekening",
                element: <RekeningPage />,
            },
            {
                path: "laporan",
                element: <LaporanPage />,
            },
            {
                path: "transfer",
                element: <TransferPage />,
            },
            {
                path: "settings",
                element: <SettingsPage />,
            },
        ],
    },
]);

export default Router;