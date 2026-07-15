import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import { api } from "@/api/api";
import { apiRequest } from "@/api/interceptor";
import { Routes } from "@/routes/routes";

import { toast } from "sonner";

import {
  Loader2,
  CalendarDays,
  ReceiptIndianRupee,
  Car,
  ArrowRight,
  User,
  Clock3,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const statusConfig = {
  inprogress: {
    text: "Active",
    badge: "bg-blue-100 text-blue-700 border border-blue-200",
    border: "border-l-blue-500",
  },
  completed: {
    text: "Completed",
    badge: "bg-green-100 text-green-700 border border-green-200",
    border: "border-l-green-500",
  },
  cancelled: {
    text: "Cancelled",
    badge: "bg-red-100 text-red-700 border border-red-200",
    border: "border-l-red-500",
  },
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatTime = (time) => {
  if (!time) return "--";

  const [hour, minute] = time.split(":").map(Number);

  const date = new Date();
  date.setHours(hour);
  date.setMinutes(minute);

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const Bookings = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [bookings, setBookings] = useState([]);

  const [cancelLoader, setCancelLoader] = useState({
    status: false,
    id: null,
  });

  async function getAllBookings() {
    try {
      setLoading(true);

      const response = await apiRequest.get(api.Bookings + "/all");

      setBookings(response);
    } catch (err) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }

  async function cancelBooking(id) {
    try {
      setCancelLoader({
        status: true,
        id,
      });

      await apiRequest.delete(api.Bookings + `/${id}`);

      toast.success("Booking cancelled");

      getAllBookings();
    } catch (err) {
      toast.error("Unable to cancel booking");
    } finally {
      setCancelLoader({
        status: false,
        id: null,
      });
    }
  }

  useEffect(() => {
    getAllBookings();
  }, []);

  const stats = useMemo(() => {
    return {
      total: bookings.length,
      active: bookings.filter((x) => x.status === "inprogress").length,
      completed: bookings.filter((x) => x.status === "completed").length,
      cancelled: bookings.filter((x) => x.status === "cancelled").length,
    };
  }, [bookings]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}

        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-5xl font-bold tracking-tight">My Bookings</h1>

            <p className="mt-2 text-muted-foreground text-lg">
              Manage and track your reservations.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-5 text-center">
                <p className="text-sm text-muted-foreground">Total</p>
                <h2 className="text-3xl font-bold">{stats.total}</h2>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-5 text-center">
                <p className="text-sm text-muted-foreground">Active</p>
                <h2 className="text-3xl font-bold text-blue-600">
                  {stats.active}
                </h2>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-5 text-center">
                <p className="text-sm text-muted-foreground">Completed</p>
                <h2 className="text-3xl font-bold text-green-600">
                  {stats.completed}
                </h2>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-5 text-center">
                <p className="text-sm text-muted-foreground">Cancelled</p>
                <h2 className="text-3xl font-bold text-red-600">
                  {stats.cancelled}
                </h2>
              </CardContent>
            </Card>
          </div>
        </div>

        {bookings.length === 0 ? (
          <Card className="rounded-3xl">
            <CardContent className="py-20 text-center">
              <Car className="mx-auto mb-4 h-16 w-16 text-slate-300" />

              <h2 className="text-2xl font-bold">No Bookings Found</h2>

              <p className="mt-2 text-muted-foreground">
                Your bookings will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {bookings.map((booking) => (
              <Card
                key={booking.id}
                onClick={() =>
                  navigate(Routes.UpdateBooking + "/" + booking.id)
                }
                className={`group cursor-pointer overflow-hidden rounded-3xl border-l-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                  (statusConfig[booking.status] ?? statusConfig.inprogress)
                    .border
                }`}
              >
                <CardHeader className="space-y-5">
                  {/* Vehicle */}

                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                          <Car className="h-6 w-6 text-blue-600" />
                        </div>

                        <div>
                          <h2 className="text-xl font-bold">
                            {booking.vehicle.brand} {booking.vehicle.name}
                          </h2>

                          <p className="text-sm text-muted-foreground">
                            {booking.vehicle.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Badge
                      className={`${
                        (
                          statusConfig[booking.status] ??
                          statusConfig.inprogress
                        ).badge
                      } px-3 py-1`}
                    >
                      {
                        (
                          statusConfig[booking.status] ??
                          statusConfig.inprogress
                        ).text
                      }
                    </Badge>
                  </div>

                  {/* Route */}

                  <div className="rounded-2xl bg-slate-50 p-5">
                    <div className="flex">
                      <div className="mr-5 flex flex-col items-center">
                        <div className="h-3 w-3 rounded-full bg-green-500" />

                        <div className="h-14 w-[2px] bg-slate-300" />

                        <div className="h-3 w-3 rounded-full bg-red-500" />
                      </div>

                      <div className="flex-1 space-y-6">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            Pickup Location
                          </p>

                          <p className="mt-1 text-lg font-semibold">
                            {booking.pickupLocation?.name}
                          </p>

                          <p className="text-sm text-muted-foreground">
                            {booking.pickupLocation?.city},{" "}
                            {booking.pickupLocation?.state}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            Drop Location
                          </p>

                          <p className="mt-1 text-lg font-semibold">
                            {booking.dropLocation?.name}
                          </p>

                          <p className="text-sm text-muted-foreground">
                            {booking.dropLocation?.city},{" "}
                            {booking.dropLocation?.state}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5">
                  {/* Dates */}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border bg-slate-50 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-blue-600" />
                        <span className="text-xs uppercase tracking-wide text-muted-foreground">
                          Pickup
                        </span>
                      </div>

                      <p className="text-lg font-semibold">
                        {formatDate(booking.start_date)}
                      </p>

                      <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock3 className="h-4 w-4" />
                        {formatTime(booking.start_time)}
                      </div>
                    </div>

                    <div className="rounded-2xl border bg-slate-50 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-red-600" />
                        <span className="text-xs uppercase tracking-wide text-muted-foreground">
                          Return
                        </span>
                      </div>

                      <p className="text-lg font-semibold">
                        {formatDate(booking.to_date)}
                      </p>

                      <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock3 className="h-4 w-4" />
                        {formatTime(booking.end_time)}
                      </div>
                    </div>
                  </div>

                  {/* Amount */}

                  <div className="flex items-center justify-between rounded-2xl border border-green-200 bg-green-50 p-5">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Amount
                      </p>

                      <h2 className="mt-1 text-3xl font-bold text-green-700">
                        ₹{booking.total_price.toLocaleString()}
                      </h2>
                    </div>

                    <div className="rounded-full bg-green-100 p-3">
                      <ReceiptIndianRupee className="h-8 w-8 text-green-700" />
                    </div>
                  </div>

                  {/* User */}

                  <div className="rounded-2xl border bg-white p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-slate-100 p-2">
                        <User className="h-5 w-5 text-slate-600" />
                      </div>

                      <div>
                        <p className="font-semibold">
                          {booking.user?.guest
                            ? booking.guest_name
                            : booking.user?.name}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          {booking.user?.guest
                            ? booking.guest_email
                            : booking.user?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle */}

                  <div className="flex items-center justify-between rounded-2xl border bg-white p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-blue-100 p-2">
                        <Car className="h-5 w-5 text-blue-600" />
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">Vehicle</p>

                        <p className="font-semibold">
                          {booking.vehicle.brand} {booking.vehicle.name}
                        </p>
                      </div>
                    </div>

                    <Badge variant="secondary">
                      ₹{booking.vehicle.price}/day
                    </Badge>
                  </div>

                  {/* Booking ID */}

                  <div className="rounded-xl border bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Booking ID
                    </p>

                    <p className="mt-2 truncate font-mono text-sm">
                      {booking.id}
                    </p>
                  </div>
                  {/* Footer */}

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(Routes.UpdateBooking + "/" + booking.id);
                      }}
                    >
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    {booking.status === "inprogress" && (
                      <Button
                        variant="destructive"
                        disabled={
                          cancelLoader.status && cancelLoader.id === booking.id
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          cancelBooking(booking.id);
                        }}
                      >
                        {cancelLoader.status &&
                        cancelLoader.id === booking.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Cancel"
                        )}
                      </Button>
                    )}

                    {booking.status === "completed" && (
                      <Button variant="secondary" disabled>
                        Completed
                      </Button>
                    )}

                    {booking.status === "cancelled" && (
                      <Button variant="outline" disabled>
                        Cancelled
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
