// SideBar.js

import { useState, useEffect, useRef } from "react";
import "./SideBar.css";

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
      <button onClick={toggleSidebar} className="rounded-full bg-red-600">
        Open Sidebar
      </button>
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-4 sidebar${isSidebarOpen ? ' sidebar-open' : ''}`}
      >
        <div>
          
        </div>
        <p>This is your sidebar content</p>
      </div>
    </>
  );
}
