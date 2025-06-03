'use client'

import React, { ReactNode } from "react";
import AdminSideBar from "../Sidebar";
import Header from "../Header";
import viVN from 'antd/locale/vi_VN';
import { ConfigProvider } from 'antd';
import 'dayjs/locale/vi';
import dayjs from "dayjs";
dayjs.locale('vi');
import '../../styles/few.css'
interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {

  const [isOpened, setIsOpened] = React.useState(false);
  return (
    <ConfigProvider locale={viVN}>
      <div className="bg-gray-200">
        <div className='flex h-screen overflow-hidden'>
          <AdminSideBar sidebarOpen={isOpened} setSidebarOpen={setIsOpened} />
          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <Header sidebarOpen={isOpened} setSidebarOpen={setIsOpened} />
            <main className="z-0">
              <div className="mx-auto p-4 md:p-6 2xl:p-10 flex-1">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}