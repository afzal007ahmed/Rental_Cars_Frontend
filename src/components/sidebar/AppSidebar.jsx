import { CalendarDays, Car, Search } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useContext, useState } from "react";
import { AppContext } from "@/contexts/AppContextWrapper";
import { useNavigate } from "react-router";
import { Routes } from "@/routes/routes";
import { Button } from "../ui/button";

const items = [
  {
    title: "Search",
    url: "/search",
    icon: Search,
  },
  {
    title: "Bookings",
    url: "/bookings",
    icon: CalendarDays,
  },
];

export function AppSidebar() {
  const nav = useNavigate();
  const { state } = useContext(AppContext);
  const { user } = state.data;
  const isGuest = user.guest;
  return (
    <Sidebar className="border-r">
      <div className="flex h-full flex-col">
        <SidebarHeader className="border-b px-5 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
              <Car className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-lg font-bold">RentEase</h2>
              <p className="text-xs text-muted-foreground">Vehicle Rental</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="flex-1 px-4 py-6">
          <SidebarMenu className="space-y-3">
            {items.map(
              (item) =>
                ((item.url === Routes.Bookings && !isGuest) ||
                  item.url !== Routes.Bookings) && (
                  <SidebarMenuItem
                    key={item.title}
                    onClick={() => nav(item.url)}
                  >
                    <div
                      className={`flex  items-center gap-4 hover:bg-gray-200 hover:text-black p-2 rounded-md cursor-pointer ${window.location.pathname === item.url && "bg-black text-white transition-all"}`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="text-base font-medium">
                        {item.title}
                      </span>
                    </div>
                  </SidebarMenuItem>
                ),
            )}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t p-4">
          {!isGuest && (
            <Button
              className="bg-red-600 text-white font-bold"
              onClick={() => {
                localStorage.removeItem("token");
                nav(Routes.Login);
              }}
            >
              Log out
            </Button>
          )}
          {isGuest && (
            <Button
              className="bg-gray-600 text-white font-bold"
              onClick={() => {
                localStorage.removeItem("token");
                nav(Routes.Register);
              }}
            >
              Log in
            </Button>
          )}
          <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
              A
            </div>

            <div className="overflow-hidden">
              <p className="truncate font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
