import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom"; // Import Link
import "./styles/SideBar.css";

export default function SideBar() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebarButton = document.querySelector(".bg-red-600");

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

  
  return (
    <>
    <div className="sidebar-wrap">
      <button onClick={toggleSidebar} className="rounded-full bg-red-600">
        Open Sidebar
      </button>
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 bg-black text-white p-4 sidebar${isSidebarOpen ? ' sidebar-open' : ''}`}
      >
        <div className="link-wrap">
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

      </div>
    </div>
    </>
  );
}
