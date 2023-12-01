import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import NavigationBar from "../components/NavigationBar";

export default function GuestLayout() {
    const {token} = useStateContext();
    if (token) {
        return <Navigate to="/Admin/EditMenuForm" />
    }
    
    return(
        <>
        <NavigationBar />
        <Outlet />
        </>
    )
}