import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "./page-groups/AdminLayout";
import EditItem from "./pages/administrator/EditItem";
import EditCategory from "./pages/administrator/EditCategory";
import AdminLogin from "./pages/administrator/AdminLogin";
import AccessableLayout from "./page-groups/AccessableLayout";
import GuestLayout from "./page-groups/GuestLayout";
import ItemList from "./pages/administrator/ItemList";
import Home from "./pages/accessable/home";
import ProductDetails from "./pages/accessable/ProductDetails";

const router = createBrowserRouter([
    {
        path: '/',
        element: <AccessableLayout />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/Product',
                element: <ProductDetails />
            },
        ]
    },
    {
        path: '/',
        element: <GuestLayout />,
        children: [
            {
                path: '/Admin',
                element: <AdminLogin />
            },
        ]
    },
    {
        path: '/',
        element: <AdminLayout />,
        children: [
            {
                path: '/Admin/EditItem',
                element: <EditItem key="userCreate"/>
            },
            {
                path: 'Admin/EditItem/:id',
                element: <EditItem key="userUpdate"/>
            },
            {
                path:'/Admin/EditCategories',
                element: <EditCategory key="userCreate"/>
            },
            {
                path:'/Admin/EditCategories/:id',
                element: <EditCategory key="userUpdate"/>
            },
            {
                path: '/Admin/ItemList',
                element: <ItemList />
            }
        ]
    }
]);

export default router;
