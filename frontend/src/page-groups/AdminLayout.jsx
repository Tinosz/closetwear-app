import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";

export default function AdminLayout() {
    const {token} = useStateContext();
    if (!token) {
        return <Navigate to="/" />
    }
    
    return(
        <>
        <Outlet />
        </>
    )
}