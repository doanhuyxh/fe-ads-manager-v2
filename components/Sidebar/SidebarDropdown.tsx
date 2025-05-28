
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarDropdownProps {
  item: {
    label: string;
    route: string;
  }[];
}

const SidebarDropdown = ({ item }: SidebarDropdownProps) => {
  const pathname = usePathname();

  return (
    <>
      <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
        {item.map((item: any, index: number) => (
          <li key={index}>
            <Link
              href={item.route}
              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium  duration-300 ease-in-out hover:text-blue-800 ${
                pathname === item.route ? "bg-gray-300 py-2 text-blue-600" : "text-black-2"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default SidebarDropdown;