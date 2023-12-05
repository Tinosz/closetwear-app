import { useRef, useState } from "react"
import { useStateContext } from "../../context/ContextProvider";
import axiosClient from "../../client/axios-client";
import signin from "../page-assets/signin.jpg";
import "./styles/AdminLoginStyles.css";


export default function AdminLogin(){
    const usernameRef = useRef();
    const passwordRef = useRef();

    const [errors, setErrors] = useState(null);

    const { setAdmin, setToken } = useStateContext();
    
    const onSubmit = (e) => {
        e.preventDefault();
        const payload = {
            username: usernameRef.current.value,
            password: passwordRef.current.value,
        }
        setErrors(null);
        console.log(payload)
        axiosClient.post("adminLogin", payload)
        .then(({data}) => {
            setAdmin(data.admin);
            setToken(data.token);
            navigate("/Admin/EditMenuForm");
        })
        .catch((err) => {
            const response = err.response;
            if (response && response.status === 422){
                if (response.data.errors) {
                    setErrors(response.data.errors);
                } else {
                    setErrors({
                        username: [response.data.message],
                    })
                }
            }
        })
    }

    return(
        <>
        <div className="wrap-signin">
            <form className="signin-form" onSubmit={onSubmit}>
            {errors && errors.username && (
                <div className="bg-red-300 rounded-xl p-2 my-2 border-red-600">
                    <p className="text-red-600">{errors.username[0]}</p>
                </div>
            )}
                <span className="signin-form-title">
                    Sign In
                </span>
                
                <div className="wrap-input">
                    <input className="input" ref={usernameRef}/>
                    <span className="focus-input"></span>
                    <span className="label-input">Admin Username</span>
                </div>
                <div className="wrap-input">
                    <input className="input" type="password" ref={passwordRef}/>
                    <span className="focus-input"></span>
                    <span className="label-input">Password</span>
                </div>

                <div className="signin-btn-container">
                    <button className="signin-btn">Sign In</button>
                </div>

                <div className="text-center">
                    <span>or sign up using</span>
                </div>                
            </form>

            <div className="signin-image" style={{ backgroundImage: `url(${signin})` }}>
                
            </div>
        </div>
        </>
    )
}