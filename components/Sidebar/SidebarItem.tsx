import React from "react";
import Link from "next/link";
import SidebarDropdown from "./SidebarDropdown";
import { usePathname } from "next/navigation";

const SidebarItem = ({ item, pageName, setPageName }:any) => {
  const pathname = usePathname();

  const isActive = (item:any) => {
    if (item.route === pathname) return true;
    return item.children?.some((child:any) => isActive(child)) || false;
  };

  const isItemActive = isActive(item);
  const isDropdownOpen = pageName === item.label.toLowerCase();

  const handleClick = () => {
    setPageName(isDropdownOpen ? "" : item.label.toLowerCase());
  };

  const itemClasses = `${
    isItemActive ? "bg-blue-500 text-white" : "text-blue-500"
  } group relative flex items-center gap-2.5 rounded-lg px-4 py-2 font-medium text-black duration-300 ease-in-out hover:bg-gray-300 dark:hover:bg-meta-4 cursor-pointer`;

  const renderIcon = () => (
    item.children && (
      <svg
        className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current transition-transform duration-300 ${
          isDropdownOpen ? "rotate-180" : ""
        }`}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
        />
      </svg>
    )
  );

  return (
    <li>
      {item.route === "#" ? (
        <div onClick={handleClick} className={itemClasses}>
          {item.icon}
          {item.label}
          {renderIcon()}
        </div>
      ) : (
        <Link href={item.route} onClick={handleClick} className={itemClasses}>
          {item.icon}
          {item.label}
          {renderIcon()}
        </Link>
      )}

      {item.children && isDropdownOpen && (
        <div className="translate transform overflow-hidden">
          <SidebarDropdown item={item.children} />
        </div>
      )}
    </li>
  );
};

export default SidebarItem;