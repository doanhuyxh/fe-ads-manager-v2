"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandHoldingDollar,
  faDollarSign,
  faBuilding,
  faUsers,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import SidebarItem from "./SidebarItem";
import ClickOutside from "./ClickOutside";
import useLocalStorage from "../../hooks/useLocalStorage";
import { logout } from "../../libs/ApiClient/AuthApi";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  route?: string;
  roles: string[]; // quyền được phép truy cập
}

const menuItems: MenuItem[] = [
  {
    icon: <FontAwesomeIcon icon={faFacebook} />,
    label: "Báo cáo fb",
    route: "/report",
    roles: ["user", "admin"],
  },
  {
    icon: <FontAwesomeIcon icon={faHandHoldingDollar} />,
    label: "Chi phí",
    route: "/ads-facebook",
    roles: ["user", "admin"],
  },
  {
    icon: <FontAwesomeIcon icon={faDollarSign} />,
    label: "Doanh thu",
    route: "/revenue",
    roles: ["user", "admin"],
  },
  {
    icon: <FontAwesomeIcon icon={faBuilding} />,
    label: "Cài đặt công ty",
    route: "/settings",
    roles: ["admin"],
  },
  // {
  //   icon: <FontAwesomeIcon icon={faUsers} />,
  //   label: "Quản lý thành viên",
  //   route: "/members",
  //   roles: ["admin"],
  // },
  {
    icon: <FontAwesomeIcon icon={faClock} />,
    label: "Hẹn giờ",
    route: "/scheduler",
    roles: ["user", "admin"],
  },
];

const AdminSideBar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    
    const userRole = localStorage.getItem("role"); // ví dụ: 'admin' hoặc 'user'
    setRole(userRole);
  }, []);

  const LogOut = async () => {
    await logout();
    window.location.href = "/";
  };

//   const filteredMenu = menuItems.filter((item) => item.roles.includes(role || ""));
  const filteredMenu = menuItems;

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`absolute left-0 top-0 flex h-screen w-72.5 flex-col overflow-y-hidden bg-white shadow-2xl duration-300 ease-linear lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-0 px-4 py-4 lg:mt-9 lg:px-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-controls="sidebar"
              className="block lg:hidden text-black"
            >
              <svg
                className="fill-current"
                width="20"
                height="18"
                viewBox="0 0 20 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                />
              </svg>
            </button>

            <ul className="mb-6 flex flex-col gap-1.5">
              {filteredMenu.map((menuItem, index) => (
                <SidebarItem
                  key={index}
                  item={menuItem}
                  pageName={pageName}
                  setPageName={setPageName}
                />
              ))}
            </ul>

            <div
              onClick={LogOut}
              className="flex items-center gap-2.5 rounded-lg px-4 py-2 font-medium text-red-500 duration-300 ease-in-out hover:bg-gray-300 dark:hover:bg-meta-4 cursor-pointer"
            >
              <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
            </div>
          </nav>
        </div>
      </aside>
    </ClickOutside>
  );
};

export default AdminSideBar;
