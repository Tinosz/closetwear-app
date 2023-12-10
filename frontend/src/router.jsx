import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "./page-groups/AdminLayout";
import EditItem from "./pages/administrator/EditItem";
import EditCategory from "./pages/administrator/EditCategory";
import AdminLogin from "./pages/administrator/AdminLogin";
import AccessableLayout from "./page-groups/AccessableLayout";
import GuestLayout from "./page-groups/GuestLayout";
import ItemList from "./pages/administrator/ItemList";
import BannerList from "./pages/administrator/BannerList";
import EditBanner from "./pages/administrator/EditBanner";
import SearchPage from "./page-groups/SearchPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AccessableLayout />,
    children: [
        {
            path: "/Search",
            element: <SearchPage />,
        },
    ],
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/Admin",
        element: <AdminLogin />,
      },
    ],
  },
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      {
        path: "/Admin/EditItem",
        element: <EditItem key="userCreate" />,
      },
      {
        path: "Admin/EditItem/:id",
        element: <EditItem key="userUpdate" />,
      },
      {
        path: "/Admin/EditCategories",
        element: <EditCategory key="userCreate" />,
      },
      {
        path: "/Admin/EditCategories/:id",
        element: <EditCategory key="userUpdate" />,
      },
      {
        path: "/Admin/ItemList",
        element: <ItemList />,
      },
      {
        path: "Admin/BannerList",
        element: <BannerList />,
      },
      {
        path: "Admin/EditBanner",
        element: <EditBanner key="userCreate" />,
      },
      {
        path: "Admin/EditBanner/:id",
        element: <EditBanner key="userUpdate" />,
      },
      
    ],
  },
]);

export default router;
