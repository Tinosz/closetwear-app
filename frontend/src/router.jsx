import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "./page-groups/AdminLayout";
import EditItem from "./pages/administrator/EditItem";

const router = createBrowserRouter([
    {
        // Add your default route configuration here if needed
    },
    {
        path: '/',
        element: <AdminLayout />,
        children: [
            {
                path: '/Admin/EditItem',
                element: <EditItem />
            }
        ]
    }
]);

export default router;
