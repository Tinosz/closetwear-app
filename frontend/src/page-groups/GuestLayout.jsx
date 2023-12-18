import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";

export default function GuestLayout() {
    const {token} = useStateContext();
    if (token) {
        return <Navigate to="/Admin/ItemList" />
    }
    
    return(
        <>
        <NavigationBar />
        <Outlet />
        <Footer/>
        </>
    )
}