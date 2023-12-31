import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom"; // Import Link
import "./styles/SideBar.css";
import axiosClient from "../client/axios-client";
import { useStateContext } from "../context/ContextProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";

export default function SideBar() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const { token, setToken, setAdmin } = useStateContext();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebarButton = document.querySelector(".toggle-button-button");

      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        sidebarButton &&
        !sidebarButton.contains(event.target)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const Logout = (e) => {
    e.preventDefault();
    if(token) {
      axiosClient.post("/logout").then(()=> {
        setAdmin({});
        setToken(null);
      })
    }
  } 

  
  return (
    <>
    <div className="sidebar-wrap">
      <button onClick={toggleSidebar} className="rounded-full text-white toggle-button-button">
        <FontAwesomeIcon className="toggle-button" icon={faAnglesRight} />
      </button>
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 bg-black text-white p-4 sidebar${isSidebarOpen ? ' sidebar-open' : ''}`}
      >
        <div className="link-wrap">
          <div className="logo-sidebar text-center">
              <Link className="/">
                ClosetWear
              </Link>
          </div>
          {/* Tambahkan tautan ke halaman EditCategory */}
          <a href="">
            <Link to="/Admin/EditCategories">Category List</Link>
          </a>
          <br />

          {/* Tambahkan tautan ke halaman ItemList */}
          <Link to="/Admin/ItemList">Item List</Link>
          <br />
          <Link to="/Admin/BannerList">Banner List</Link>
        </div>
        <a className="action-btn text-white" onClick={Logout}>
          Logout
        </a>
      </div>
    </div>
    </>
  );
}
