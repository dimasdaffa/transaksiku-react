import { createBrowserRouter } from "react-router-dom";
import Login from "../Pages/Auth/Login";
import AdminLayout from "../Layouts/AdminLayout";
import TransferPage from "../Pages/Transfer/TransferPage";
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
                path: "transfer",
                element: <TransferPage />,
            },
            {
                path:"dashboard",
                element: <h1>Dashboard</h1>,
            }
        ],
    },
]);

export default Router;