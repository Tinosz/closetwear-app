import { createContext, useContext, useState } from "react";


//Makes it so that people can't access other pages without the token
//except the default page
const StateContext = createContext({
    currentUser: null,
    token: null,
    setAdmin: () => {},
    setToken: () => {}
})

export const ContextProvider = ({children}) => {
    const [admin, setAdmin] = useState({
        
    });
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));

    const setToken = (token) => {
        _setToken(token)
        if (token) {
            localStorage.setItem('ACCESS_TOKEN', token);
        } else {
            localStorage.removeItem('ACCESS_TOKEN');
        }
    }


    return (
        <StateContext.Provider value={{
            admin,
            token,
            setAdmin,
            setToken,
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)