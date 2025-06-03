"use client"

import { useState, useEffect } from "react";
import { getCurrentCompany, changeCurrentCompany } from "../../libs/ApiClient/CompanyApi";
import Company from "../../libs/types/Company";

export default function Header({ sidebarOpen, setSidebarOpen }: { sidebarOpen: boolean; setSidebarOpen: (open: boolean) => void }) {
    const [companys, setCompanys] = useState<Company[]>([]);
    const [currentCompany, setCurrentCompany] = useState<string>("");

    const loadCurrentCompany = async () => {
        const json_res = await getCurrentCompany();
        if (json_res.status) {
            setCompanys(json_res.data || []);
            setCurrentCompany(json_res.message);
        }
    };

    const handleChangeCurrentCompany = async (id: string) => {
        await changeCurrentCompany(id)
        window.location.reload();
    }

    useEffect(() => {
        loadCurrentCompany();
    }, []);

    return (
        <header className="h-[80px] sticky top-0 flex w-full bg-white shadow-md z-20">
            <div className="flex flex-grow items-center justify-between px-4 py-4 md:px-6 2xl:px-11">
                {/* Sidebar toggle button */}
                <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
                    <button
                        aria-controls="sidebar"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="block rounded-lg border border-gray-300 bg-white py-2 px-3 shadow-sm hover:bg-gray-100"
                    >
                        <i className="!text-black fa-solid fa-bars" />
                    </button>
                </div>

                {/* Company selector */}
                <div className="flex items-center gap-2">
                    <label htmlFor="companySelect" className="block text-sm font-medium text-gray-700 whitespace-nowrap">
                        Công ty:
                    </label>
                    <select
                        id="companySelect"
                        value={currentCompany}
                        onChange={(e) => {
                            setCurrentCompany(e.target.value)
                            handleChangeCurrentCompany(e.target.value)
                        }}
                        className="min-w-[200px] px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 !text-black"
                    >
                        {companys.map((item, index) => (
                            <option value={item._id} key={index}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </header>
    );
}
