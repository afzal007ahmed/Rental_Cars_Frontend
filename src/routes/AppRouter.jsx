import React from "react";
import { Routes, Route } from "react-router-dom";
import { Routes as routes } from "./routes";
import Login from "@/pages/Login";
import ProtectedRoutes from "@/protectedRoutes/ProtectedRoutes";
import Home from "@/pages/Home";
import AppContextWrapper from "@/contexts/AppContextWrapper";
import Bookings from "@/pages/Bookings";
import SearchPage from "@/pages/SearchPage";
import SearchResult from "@/pages/SearchResult";
import LocationPage from "@/pages/LocationPage";
import Checkout from "@/pages/Checkout";
import GuestCheck from "@/guestcheck/GuestCheck";

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
        <Route path={routes.Home} element={<Home />} />
        <Route path={routes.Search} element={<SearchPage />} />
        <Route element={<GuestCheck />}>
          <Route path={routes.Bookings} element={<Bookings />} />
        </Route>
        <Route path={routes.SearchResult} element={<SearchResult />} />
        <Route path={routes.Store} element={<LocationPage />} />
        <Route
          path={routes.Checkout + "/:locationId/:vehicleId"}
          element={<Checkout />}
        />
      </Route>
    </Routes>
  );
};

export default AppRouter;
