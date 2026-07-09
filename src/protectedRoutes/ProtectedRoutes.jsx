import React, { useContext, useEffect, useState } from "react";
import { apiRequest } from "@/api/interceptor";
import { api } from "@/api/api";
import { AppContext } from "@/contexts/AppContextWrapper";
import { Loader2 } from "lucide-react";
import { Outlet, useLocation } from "react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";

const ProtectedRoutes = () => {
  const { state, dispatch } = useContext(AppContext);

  async function fetchMe() {
    dispatch({ type: "LOADING" });
    const user = await apiRequest.get(api.Me);
    console.log(user);
    dispatch({ type: "FETCH_USER_DETAILS", payload: user });
  }

  useEffect(() => {
    fetchMe();
  }, []);
 

  return (
    <div className="relative">
      {state.loading && (
        <div className="absolute top-0 h-[100vh] w-full">
          <div className="absolute top-0 opacity-[0.4]"></div>
          <div className="flex justify-center h-full w-full items-center absolute top-0">
            <Loader2 className="animate-spin" />
          </div>
        </div>
      )}

      {state?.data?.user && !state.loading && (
        <div>
          <SidebarProvider>
            <AppSidebar />
            <div className="relative w-full">
              <SidebarTrigger className="absolute" />
              <div className="md:p-12 w-full h-[100vh] flex-1">
                <Outlet />
              </div>
            </div>
          </SidebarProvider>
        </div>
      )}
    </div>
  );
};

export default ProtectedRoutes;
