import React from "react";
import { Routes, Route } from "react-router-dom";
import { Routes as routes } from "./routes";
import Login from "@/pages/Login";
import ProtectedRoutes from "@/protectedRoutes/ProtectedRoutes";
import Home from "@/pages/Home";
import AppContextWrapper from "@/contexts/AppContextWrapper";
import Bookings from "@/pages/Bookings";
import SearchPage from "@/pages/SearchPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path={routes.Login} element={<Login />} />
      <Route
        element={
          <AppContextWrapper>
            <ProtectedRoutes />
          </AppContextWrapper>
        }
      >
        <Route path={routes.Home} element={<Home/>} />
        <Route path={routes.Search} element={<SearchPage />} />
        <Route path={routes.Bookings} element={<Bookings />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
