import { createBrowserRouter } from "react-router-dom";
import Login from "../Pages/Auth/Login";
import AdminLayout from "../Layouts/AdminLayout";
import TransferPage from "../Pages/Transfer/TransferPage";
import DashboardPage from "../Pages/Admin/Dashboard/DashboardPage";
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
                path: "transfer",
                element: <TransferPage />,
            },
        ],
    },
]);

export default Router;