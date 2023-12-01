import { useEffect } from "react";
import { useStateContext } from "../context/ContextProvider";
import axiosClient from "../client/axios-client";
import { useNavigate } from "react-router-dom";

export default function NavigationBar() {
    const navigate = useNavigate();
    const { token, setToken, setAdmin } = useStateContext();

    const Logout = (e) => {
        e.preventDefault();
        if(token){
            axiosClient.post("/logout").then(()=>{
                setAdmin({});
                setToken(null);
            })
        }
    }

    useEffect(()=> {
        if (token){
            axiosClient.get("/admin/user").then(({data}) => {
                setAdmin(data);
            })
        }
    }, []);


    return (
        <>
            {token ? (
                <a href="/" onClick={Logout} className="rounded-full bg-red-600">Logout</a>
            ) : (
                <>
                
                </>
            )}
        </>
    );
}
