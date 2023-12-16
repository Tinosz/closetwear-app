import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";

export default function AccessableLayout() {

    
    return(
        <>
        <NavigationBar />
        <Outlet />
        <Footer/>
        </>
    )
}