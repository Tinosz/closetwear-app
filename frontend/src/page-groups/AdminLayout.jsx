import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import SideBar from "../components/SideBar";
import "./styles/AdminLayout.css";

export default function AdminLayout() {
    const { token } = useStateContext();
    if (!token) {
      return <Navigate to="/" />;
    }

  return (
    <>
      <SideBar />
      <div className="main-content">

        <Outlet />
      </div>
    </>
  );
}