import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

import { api } from "@/api/api";
import { apiRequest } from "@/api/interceptor";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { format } from "date-fns";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/utils/dateFormater";

const BookingUpdate = () => {
  const { id } = useParams();
  const selectedCar = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [vehicles, setVehicles] = useState({
    loading: false,
    error: null,
    data: null,
  });

  async function getVehicles() {
    try {
      setVehicles((prev) => ({ ...prev, loading: true }));
      const params = new URLSearchParams({
        start_date: formatDate(bookingData.start_date),
        to_date: formatDate(bookingData.to_date),
      });

      const data = await apiRequest.get(
        api.Locations + bookingData.location_id + "?" + params.toString(),
      );
      setVehicles((prev) => ({ ...prev, loading: false, data: data }));
    } catch (error) {
      setVehicles((prev) => ({
        ...prev,
        error: error.reponse?.data?.message || error.message,
        loading: false,
      }));
    }
  }

  async function fetchBooking() {
    try {
      setLoading(true);
      const data = await apiRequest.get(api.Bookings + "/" + id);
      setBookingData({
        ...data,
        start_date: new Date(data.start_date),
        to_date: new Date(data.to_date),
      });
      selectedCar.current = data.vehicle_id;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBooking();
  }, []);

  useEffect(() => {
    if (bookingData?.start_date && bookingData?.to_date) {
      if (bookingData.start_date >= bookingData.to_date) {
        toast.error("Please select a valid date range" , { position : "bottom-center"});
        return;
      }
      getVehicles();
    }
  }, [bookingData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!bookingData) return null;

  async function handleUpdate() {
    try {
      const startDate = bookingData.start_date;
      const endDate = bookingData.to_date;
      if (startDate >= endDate) {
        toast.error("Please enter a valid date range", {
          position: "bottom-center",
        });
        return;
      }
    } catch (error) {}
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <section className="bg-gradient-to-r from-slate-950 to-slate-800 px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
            Booking Management
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black">Update Booking</h1>

              <p className="mt-2 text-slate-300">
                Booking ID #{bookingData.id}
              </p>
            </div>

            <Badge
              className={
                bookingData.status === "inprogress"
                  ? "bg-green-600 px-5 py-2 text-white"
                  : "bg-slate-500 px-5 py-2 text-white"
              }
            >
              {bookingData.status}
            </Badge>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-8 px-6 py-10 lg:grid-cols-[1fr_350px]">
        {/* Main Form */}

        <div className="space-y-8">
          {/* Vehicle */}

          <Card>
            <CardContent className="space-y-5 p-6">
              <h2 className="text-xl font-bold">🚗 Vehicle Details</h2>

              {bookingData.status === "inprogress" ? (
                <Select
                  value={String(bookingData.vehicle_id)}
                  onValueChange={(value) => {
                    setBookingData((prev) => ({
                      ...prev,
                      vehicle_id: value,
                    }));
                  }}
                >
                  <SelectTrigger className="h-16 rounded-xl border-slate-200 bg-white">
                    <SelectValue>
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            vehicles.data?.images?.[
                              bookingData.vehicle_id
                            ]?.[0] || "/car-placeholder.png"
                          }
                          alt={bookingData.vehicle.name}
                          className="h-10 w-16 rounded-lg object-cover"
                        />

                        <div className="text-left">
                          <p className="font-semibold">
                            {bookingData.vehicle.brand}{" "}
                            {bookingData.vehicle.name}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            ₹{bookingData.vehicle.price}/day
                          </p>
                        </div>
                      </div>
                    </SelectValue>
                  </SelectTrigger>

                  <SelectContent className="w-[450px]">
                    {vehicles.loading ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        Loading vehicles...
                      </div>
                    ) : vehicles.data?.data?.length > 0 ? (
                      vehicles.data.data.map((item) => {
                        const image =
                          vehicles.data.images?.[item.vehicle.id]?.[0];

                        const isAvailable = item.status === "available";

                        return (
                          <SelectItem
                            key={item.vehicle.id}
                            value={String(item.vehicle.id)}
                            disabled={!isAvailable}
                            className="py-4"
                          >
                            <div className="flex w-full items-center gap-4">
                              {/* Image */}
                              <img
                                src={image || "/car-placeholder.png"}
                                alt={item.vehicle.name}
                                className="
        h-20
        w-28
        rounded-xl
        object-cover
        shadow-sm
      "
                              />

                              {/* Vehicle Info */}
                              <div className="flex-1">
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="font-bold text-slate-900">
                                        {item.vehicle.brand}
                                      </p>

                                      {String(selectedCar.current) ===
                                        String(item.vehicle_id) && (
                                        <span
                                          className="
                  inline-flex
                  items-center
                  gap-1
                  rounded-full
                  bg-blue-100
                  px-2.5
                  py-1
                  text-[11px]
                  font-semibold
                  text-blue-700
                  ring-1
                  ring-blue-200
                "
                                        >
                                          ✓ Your current Car
                                        </span>
                                      )}
                                    </div>

                                    <p className="text-sm text-slate-500">
                                      {item.vehicle.name}
                                    </p>
                                  </div>

                                  <Badge
                                    className={
                                      isAvailable
                                        ? "bg-emerald-600 text-white hover:bg-emerald-600"
                                        : "bg-red-600 text-white hover:bg-red-600"
                                    }
                                  >
                                    {isAvailable
                                      ? `${item.available_units} Available`
                                      : "Sold Out"}
                                  </Badge>
                                </div>

                                {/* Bottom Info */}
                                <div className="mt-3 flex items-center justify-between">
                                  <div>
                                    <span className="text-lg font-bold text-green-700">
                                      ₹{item.vehicle.price}
                                    </span>

                                    <span className="text-sm text-slate-500">
                                      /day
                                    </span>
                                  </div>

                                  <span
                                    className={`
            text-xs font-medium
            ${isAvailable ? "text-emerald-600" : "text-red-500"}
          `}
                                  >
                                    {isAvailable
                                      ? "✓ Ready for booking"
                                      : "Currently unavailable"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        );
                      })
                    ) : (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No vehicles found
                      </div>
                    )}
                  </SelectContent>
                </Select>
              ) : (
                <div className="rounded-xl bg-slate-100 p-4 font-semibold">
                  {bookingData.vehicle.brand} {bookingData.vehicle.name}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dates */}

          <Card>
            <CardContent className="space-y-6 p-6">
              <h2 className="text-xl font-bold">📅 Trip Schedule</h2>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Pickup Date
                  </label>

                  {bookingData.status === "inprogress" ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-12 w-full justify-start"
                        >
                          {bookingData.start_date.getDate()}/
                          {bookingData.start_date.getMonth()}/
                          {bookingData.start_date.getFullYear()}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="p-0">
                        <Calendar
                          mode="single"
                          selected={bookingData.start_date}
                          onSelect={(date) => {
                            if (!date) return;

                            date.setHours(0, 0, 0);

                            setBookingData((prev) => ({
                              ...prev,
                              start_date: date,
                            }));
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Input disabled value={bookingData.to_date} />
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Return Date
                  </label>

                  {bookingData.status === "inprogress" ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-12 w-full justify-start"
                        >
                          {bookingData.to_date.getDate()}/
                          {bookingData.to_date.getMonth()}/
                          {bookingData.to_date.getFullYear()}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="p-0">
                        <Calendar
                          mode="single"
                          selected={bookingData.to_date}
                          onSelect={(date) => {
                            if (!date) return;

                            date.setHours(0, 0, 0);

                            setBookingData((prev) => ({
                              ...prev,
                              to_date: date,
                            }));
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Input
                      disabled
                      value={format(bookingData?.to_date, "PPP")}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer */}

          <Card>
            <CardContent className="space-y-5 p-6">
              <h2 className="text-xl font-bold">👤 Customer Information</h2>

              <Input
                disabled={!bookingData.user.guest}
                placeholder="Name"
                value={
                  bookingData.user.guest
                    ? (bookingData.guest_name ?? "")
                    : bookingData.user.name
                }
                onChange={(e) =>
                  setBookingData((prev) => ({
                    ...prev,
                    guest_name: e.target.value,
                  }))
                }
              />

              <Input
                disabled={!bookingData.user.guest}
                placeholder="Email"
                value={
                  bookingData.user.guest
                    ? (bookingData.guest_email ?? "")
                    : bookingData.user.email
                }
                onChange={(e) =>
                  setBookingData((prev) => ({
                    ...prev,
                    guest_email: e.target.value,
                  }))
                }
              />
            </CardContent>
          </Card>
        </div>

        {/* Summary */}

        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardContent className="space-y-6 p-6">
              <h2 className="text-xl font-black">Booking Summary</h2>

              <div className="rounded-2xl bg-green-50 p-5">
                <p className="text-sm text-green-700">Total Amount</p>

                <p className="mt-2 text-4xl font-black text-green-700">
                  ₹{bookingData.total_price}
                </p>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Location</span>

                  <span className="font-semibold text-right">
                    {bookingData.location.name}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Status</span>

                  <span className="font-semibold">{bookingData.status}</span>
                </div>
              </div>

              {bookingData.status === "inprogress" && (
                <Button
                  className="h-14 w-full text-lg font-bold"
                  onClick={handleUpdate}
                >
                  Update Booking
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingUpdate;
