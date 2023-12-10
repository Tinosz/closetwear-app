//SearchPage.jsx

import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import NavigationBar from "../components/NavigationBar";
import SearchBar from "../components/SearchBar";

function SearchPage() {

    
    return(
        <div>
            <SearchBar 
                placeholder="Search..."
            />
        </div>
    )
}

export default SearchPage;