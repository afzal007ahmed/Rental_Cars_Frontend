import { AppContext } from "@/contexts/AppContextWrapper";
import React, { useContext } from "react";
import { Outlet } from "react-router";

const GuestCheck = () => {
  const { state } = useContext(AppContext);
  const isGuest = state?.data?.user?.guest;

  if (isGuest) {
    window.location.pathname = "/";
    return ;
  }
  return <Outlet/>;
};

export default GuestCheck;
