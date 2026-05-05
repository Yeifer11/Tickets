import type { ReactNode } from "react";
import AppSidebar from "./AppSidebar";

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
