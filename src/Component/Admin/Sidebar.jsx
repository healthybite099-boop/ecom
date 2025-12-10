"use client";
import React, { useState, useEffect } from "react";
import {
  Menu, X, Home, CopyPlus, ListTodo, Rocket, Gauge, User2Icon, UserPlus2, LayoutDashboard, MapPinHouse, MapPinPlus, Users, LayoutList, Group, Trash2, List, Users2, UserPlus,
  User,
  GitPullRequest,
  CheckSquare,
  Book,
  Calendar,
  MessageSquare,
  AlertTriangle,
  FileText,
  Phone,
  ShieldCheck,
  Download, NotebookText, MessageSquareCode,
  Mail
} from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function Sidebar({ onToggleSidebar }) {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [isLgScreen, setIsLgScreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default to true on large screens
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      const isLargeScreen = window.innerWidth >= 1024;
      setIsLgScreen(isLargeScreen);
      setIsSidebarOpen(isLargeScreen); // Sidebar open by default on large screens, closed on smaller
    };

    // Initial check on component mount
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    if (onToggleSidebar) {
      onToggleSidebar(!isSidebarOpen);
    }
  };

  const isActiveLink = (href) => pathname === href;

  return (
    <>
      <div className="absolute md:top-5 top-5 left-2 md:left-5">
        <button
          className={`cursor-pointer duration-150 p-1 rounded-lg ${isSidebarOpen ? "bg-[#2d2849] text-white" : "bg-gray-200 text-black hover:bg-[#2d2849] hover:text-white"
            }`}
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>
      <div>
        <div
          className={`absolute md:top-[70px] top-[70px] bottom-0 left-0 w-64 bg-white z-40 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform bottom-0 absolute shadow bg-white duration-300 ease-in-out`}
        >
          <div className="relative h-full flex flex-col px-2">
            <ul className=" overflow-auto h-5/6 ">
              <Link href="/admin">
                <li
                  className={`cursor-pointer text-sm px-4 py-3 duration-150 flex items-center gap-x-2 rounded-md ${isActiveLink("/admin/dashboard") ? "bg-[#2d2849] text-white" : "hover:bg-gray-100 text-gray-700 "
                    }`}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </li>
              </Link>
              <Link href="/admin/AddProduct">
                <li
                  className={`cursor-pointer text-sm px-4 py-3 duration-150 flex items-center gap-x-2 rounded-md ${isActiveLink("/admin/dashboard") ? "bg-[#2d2849] text-white" : "hover:bg-gray-100 text-gray-700 "
                    }`}
                >
                  <LayoutDashboard size={18} />
                  Add Product
                </li>
              </Link>
              <Link href="/admin/AddCategory">
                <li
                  className={`cursor-pointer text-sm px-4 py-3 duration-150 flex items-center gap-x-2 rounded-md ${isActiveLink("/admin/dashboard") ? "bg-[#2d2849] text-white" : "hover:bg-gray-100 text-gray-700 "
                    }`}
                >
                  <LayoutDashboard size={18} />
                  AddCategory
                </li>
              </Link>

               <Link href="/admin/orders">
                <li
                  className={`cursor-pointer text-sm px-4 py-3 duration-150 flex items-center gap-x-2 rounded-md ${isActiveLink("/admin/dashboard") ? "bg-[#2d2849] text-white" : "hover:bg-gray-100 text-gray-700 "
                    }`}
                >
                  <LayoutDashboard size={18} />
                  Orders
                </li>
              </Link>


            </ul>




          </div>
        </div>
      </div>
    </>
  );
}
