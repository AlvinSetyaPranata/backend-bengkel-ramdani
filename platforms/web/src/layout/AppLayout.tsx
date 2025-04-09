import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet, useNavigate } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import Security from "./Security";
import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { tokenAtom } from "../atoms/auth";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {

  const token = useAtomValue(tokenAtom)
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate("/signin")
      return
    }
  }, [])

  return (
    <Security>
      <SidebarProvider>
        <LayoutContent />
      </SidebarProvider>
    </Security>
  );
};

export default AppLayout;
