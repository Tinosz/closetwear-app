import { useRef, useState } from "react"
import { useStateContext } from "../../context/ContextProvider";
import axiosClient from "../../client/axios-client";

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
        <form onSubmit={onSubmit}>
        {errors && errors.username && (
            <div className="bg-red-300 rounded-xl p-2 my-2 border-red-600">
                <p className="text-red-600">{errors.username[0]}</p>
            </div>
        )}
        <input ref={usernameRef} placeholder="Enter the Admin Username"/>
        <input type="password" ref={passwordRef} placeholder="Enter the Password"/>
        <button>Sign In</button>
        </form>
        </>
    )
}