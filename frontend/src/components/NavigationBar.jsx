import { useEffect, useState } from "react";
import { useStateContext } from "../context/ContextProvider";
import axiosClient from "../client/axios-client";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import "./styles/NavigationBarStyles.css";

export default function NavigationBar() {
  const navigate = useNavigate();
  const { token, setToken, setAdmin } = useStateContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navbar, setNavbar] = useState(false);

  const Logout = (e) => {
    e.preventDefault();
    if (token) {
      axiosClient.post("/logout").then(() => {
        setAdmin({});
        setToken(null);
      });
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (token) {
      axiosClient.get("/admin/user").then(({ data }) => {
        setAdmin(data);
      });
    }
  }, []);

    const changeBackground = () => {
        if(window.scrollY >= 20) {
            setNavbar(true);
        } else {
            setNavbar(false);
        }  
    }
    

    window.addEventListener('scroll', changeBackground);

  return (
    <>
      <header className="nav-header">
        <div className={navbar ? 'navbar active' : 'navbar'}>
          <div className="logo"><a href="/">ClosetWear</a></div>
          <ul className="links">
            <li><a href="/">Home</a></li>
            <li><a href="/Catalog">Catalog</a></li>
            <li><a href="/">About Brand</a></li>
            <li><a href="/">Contact</a></li>
          </ul>
          {token ? (
            <a href="/" className="action-btn" onClick={Logout}>
              Logout
            </a>
          ) : (
            <>
              {/* Add your login button or other actions */}
            </>
          )}

            <div className="toggle-btn" >
                <FontAwesomeIcon icon={faBars} onClick={toggleMenu}/>
            </div>
        </div>


        <div className={`dropdown-menu ${isMenuOpen ? 'open' : ''}`}>
            <div className="toggle-btn" style={{textAlign: 'right'}}>
                <FontAwesomeIcon icon={faBars} onClick={toggleMenu}/>
            </div>
            <div className="logo"><a href="/">ClosetWear</a></div>
            <li><a href="/">Home</a></li>
            <li><a href="/">Catalog</a></li>
            <li><a href="/">About Brand</a></li>
            <li><a href="/">Contact</a></li>
            {token ? (
                <a href="/" className="action-btn" onClick={Logout}>
                Logout
                </a>
            ) : (
                <>
                {/* Add your login button or other actions */}
                </>
            )}
            
        </div>
      </header>
    </>
  );
}
