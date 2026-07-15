import { api } from "@/api/api";
import { apiRequest } from "@/api/interceptor";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import {
  CalendarDays,
  Car,
  IndianRupee,
  Mail,
  MapPin,
  User,
} from "lucide-react";

import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { AppContext } from "@/contexts/AppContextWrapper";
import { Routes } from "@/routes/routes";
import { guestCheckoutSchema } from "@/zod/schemas";
import { formatDate } from "@/utils/dateFormater";

const Checkout = () => {
  const navigator = useNavigate();
  const { state } = useContext(AppContext);
  const user = state?.data?.user;
  const name = user?.name ?? "";
  const email = user?.email ?? "";
  const { locationId, vehicleId } = useParams();
  const [searchParams] = useSearchParams();

  const startDate = new Date(searchParams.get("start_date"));
  const toDate = new Date(searchParams.get("to_date"));
  const startTime = searchParams.get("start_time");
  const endTime = searchParams.get("end_time");
  const dropLocationId = searchParams.get('drop_location_id') ;
  const isGuest = user?.guest ?? false;

  const [loading, setLoading] = useState(false);
  const [bookingLoader, setBookingLoader] = useState(false);
  const [checkoutDetails, setCheckoutDetails] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [guestDetails, setGuestDetails] = useState({
    name: "",
    email: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
  });

  const disabled = isGuest && (!guestDetails.email || !guestDetails.name);
  async function confirmBooking() {
    if (isGuest) {
      const result = guestCheckoutSchema.safeParse(guestDetails);
      if (!result.success) {
        const newErrors = { name: "", email: "" };
        result.error.issues.forEach((issue) => {
          const path = issue.path[0];
          if (path) {
            newErrors[path] = issue.message;
          }
        });
        setErrors(newErrors);
        return;
      }
    }

    try {
      const body = {
        locationId: locationId,
        vehicleId: vehicleId,
        startDate: formatDate(startDate),
        toDate: formatDate(toDate),
        guestName: guestDetails.name || null,
        guestEmail: guestDetails.email || null,
        start_time : startTime,
        end_time : endTime,
        drop_location_id : dropLocationId
      };
      setBookingLoader(true);
      const response = await apiRequest.post(api.Bookings, body);
      navigator(Routes.Confirm + `/${response.id}`);
    } finally {
      setBookingLoader(false);
    }
  }

  async function fetchCheckoutDetails() {
    try {
      setLoading(true);

      const response = await apiRequest.get(
        api.Checkout +
          `${locationId}/${vehicleId}?start_date=${startDate}&to_date=${toDate}`,
      );

      setCheckoutDetails(response.data);
      setTotalAmount(response.total_amount);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const days = (toDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

  useEffect(() => {
    if (locationId && vehicleId) {
      fetchCheckoutDetails();
    }
  }, [locationId, vehicleId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-xl font-semibold">
        Loading Checkout...
      </div>
    );
  }

  const vehicle = checkoutDetails?.vehicle;
  const pickup = checkoutDetails?.pickup;
  const images = vehicle?.images ?? [];

  if (!checkoutDetails || !vehicle) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="p-8">
          <p className="text-lg font-semibold">
            Unable to load checkout details.
          </p>
        </Card>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#2563eb25,transparent_45%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-14">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
                Secure Checkout
              </p>

              <h1 className="mt-3 text-5xl font-black text-white">
                Complete Your Booking
              </h1>

              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
                Review your vehicle details before confirming your booking. Your
                reservation will be processed instantly after confirmation.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-xl">
                <p className="text-sm text-slate-300">Pickup</p>

                <p className="mt-2 text-2xl font-bold text-white">
                  {startDate.toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-xl">
                <p className="text-sm text-slate-300">Return</p>

                <p className="mt-2 text-2xl font-bold text-white">
                  {toDate.toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Vehicle Card */}
          <Card className="group overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
            {images.length > 0 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {images.map((img, index) => (
                    <CarouselItem key={img.id}>
                      <div className="relative h-[430px] overflow-hidden">
                        <img
                          src={img.image}
                          alt={vehicle.name}
                          className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
                        />

                        {/* Dark Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Status */}
                        <div className="absolute left-6 top-6">
                          <Badge className="rounded-full bg-green-600 px-4 py-2 text-white shadow-lg">
                            Available
                          </Badge>
                        </div>

                        {/* Price */}
                        <div className="absolute right-6 top-6">
                          <div className="rounded-full bg-white px-5 py-3 shadow-xl">
                            <div className="flex items-center gap-1">
                              <IndianRupee className="h-5 w-5 text-green-600" />

                              <span className="text-2xl font-black text-green-600">
                                {vehicle.price}
                              </span>

                              <span className="text-sm text-slate-500">
                                /day
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Image Count */}
                        <div className="absolute bottom-6 right-6">
                          <Badge className="rounded-full bg-black/40 backdrop-blur-md">
                            {index + 1} / {images.length}
                          </Badge>
                        </div>

                        {/* Vehicle Name */}
                        <div className="absolute bottom-8 left-8">
                          <p className="text-lg text-slate-200">
                            {vehicle.brand}
                          </p>

                          <h2 className="mt-1 text-5xl font-black text-white">
                            {vehicle.name}
                          </h2>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {images.length > 1 && (
                  <>
                    <CarouselPrevious
                      className="
              left-5
              border-0
              bg-white/80
              backdrop-blur-md
              shadow-xl
            "
                    />

                    <CarouselNext
                      className="
              right-5
              border-0
              bg-white/80
              backdrop-blur-md
              shadow-xl
            "
                    />
                  </>
                )}
              </Carousel>
            ) : (
              <div className="flex h-[430px] items-center justify-center bg-slate-100">
                <Car className="h-28 w-28 text-slate-400" />
              </div>
            )}
            <CardContent className="space-y-8 p-8">
              {/* Vehicle Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-widest text-slate-500">
                    Premium Vehicle
                  </p>

                  <h2 className="mt-2 text-4xl font-black text-slate-900">
                    {vehicle.name}
                  </h2>

                  <p className="mt-2 text-lg text-slate-500">{vehicle.brand}</p>
                </div>

                <Badge className="rounded-full bg-green-100 px-5 py-2 text-green-700 hover:bg-green-100">
                  Available
                </Badge>
              </div>

              {/* Description */}
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="leading-8 text-slate-600">
                  {vehicle.description ?? "No description available."}
                </p>
              </div>

              {/* Pricing */}
              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-3xl border border-green-200 bg-green-50 p-6">
                  <p className="text-sm font-medium uppercase tracking-wider text-green-700">
                    Price Per Day
                  </p>

                  <div className="mt-3 flex items-center">
                    <IndianRupee className="mr-1 h-7 w-7 text-green-700" />

                    <span className="text-4xl font-black text-green-700">
                      {vehicle.price}
                    </span>
                  </div>
                </div>

                <div className="rounded-3xl border border-blue-200 bg-blue-50 p-6">
                  <p className="text-sm font-medium uppercase tracking-wider text-blue-700">
                    Rental Duration
                  </p>

                  <p className="mt-3 text-4xl font-black text-blue-700">
                    {days}
                  </p>

                  <p className="text-sm text-blue-600">
                    Day{days > 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Quick Highlights */}
              <div className="grid grid-cols-4 gap-4">
                <div className="rounded-2xl border bg-white p-5 text-center shadow-sm">
                  <Car className="mx-auto mb-3 h-7 w-7 text-blue-600" />

                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Brand
                  </p>

                  <p className="mt-2 font-bold text-slate-800">
                    {vehicle.brand}
                  </p>
                </div>

                <div className="rounded-2xl border bg-white p-5 text-center shadow-sm">
                  <CalendarDays className="mx-auto mb-3 h-7 w-7 text-indigo-600" />

                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Duration
                  </p>

                  <p className="mt-2 font-bold text-slate-800">
                    {days} Day{days > 1 ? "s" : ""}
                  </p>
                </div>

                <div className="rounded-2xl border bg-white p-5 text-center shadow-sm">
                  <IndianRupee className="mx-auto mb-3 h-7 w-7 text-green-600" />

                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Daily Rent
                  </p>

                  <p className="mt-2 font-bold text-slate-800">
                    ₹{vehicle.price}
                  </p>
                </div>

                <div className="rounded-2xl border bg-white p-5 text-center shadow-sm">
                  <Badge className="mx-auto bg-emerald-600">✓</Badge>

                  <p className="mt-3 text-xs font-semibold uppercase text-slate-500">
                    Status
                  </p>

                  <p className="mt-2 font-bold text-emerald-600">Available</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Summary */}
          <Card className="sticky top-8 rounded-[32px] border border-slate-200 bg-white shadow-xl">
            <CardContent className="space-y-8 p-8">
              {/* Header */}
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Booking Summary
                </p>

                <h2 className="mt-2 text-4xl font-black text-slate-900">
                  Review Details
                </h2>

                <p className="mt-2 text-slate-500">
                  Please verify your booking information before confirming.
                </p>
              </div>

              <Separator />

              {/* Customer */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 p-3">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Customer</p>

                    <p className="font-bold text-slate-900">
                      {isGuest ? "Guest Booking" : "Registered User"}
                    </p>
                  </div>
                </div>

                {!isGuest ? (
                  <>
                    <p className="font-semibold">{name}</p>

                    <p className="mt-1 text-slate-500">{email}</p>
                  </>
                ) : (
                  <div className="space-y-5">
                    <div>
                      <Input
                        placeholder="Enter your name"
                        value={guestDetails.name}
                        onChange={(e) => {
                          setGuestDetails((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }));
                          setErrors((prev) => ({
                            ...prev,
                            name: "",
                          }));
                        }}
                        className={
                          errors.name
                            ? "border-red-500 focus-visible:ring-red-500"
                            : ""
                        }
                      />

                      {errors.name && (
                        <p className="mt-2 text-sm text-red-500">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={guestDetails.email}
                        onChange={(e) => {
                          setGuestDetails((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }));
                          setErrors((prev) => ({
                            ...prev,
                            email: "",
                          }));
                        }}
                        className={
                          errors.email
                            ? "border-red-500 focus-visible:ring-red-500"
                            : ""
                        }
                      />

                      {errors.email && (
                        <p className="mt-2 text-sm text-red-500">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Trip Details */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="mb-5 text-xl font-bold">Trip Details</h3>

                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="h-5 w-5 text-blue-600" />

                      <span className="text-slate-600">Pickup</span>
                    </div>

                    <span className="font-semibold">
                      {startDate.toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="h-5 w-5 text-indigo-600" />

                      <span className="text-slate-600">Return</span>
                    </div>

                    <span className="font-semibold">
                      {toDate.toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-red-500" />

                      <span className="text-slate-600">Pickup Point</span>
                    </div>

                    <span className="max-w-[180px] text-right font-semibold">
                      {pickup?.name}
                    </span>
                  </div>
                </div>
              </div>
              {/* Payment Breakdown */}
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="mb-6 text-xl font-bold text-slate-900">
                  Payment Breakdown
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Vehicle</span>

                    <span className="font-semibold text-right">
                      {vehicle.brand} {vehicle.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Rental Duration</span>

                    <span className="font-semibold">
                      {days} Day{days > 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Price / Day</span>

                    <span className="font-semibold">₹{vehicle.price}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Pickup Location</span>

                    <span className="max-w-[180px] text-right font-semibold">
                      {pickup?.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Total Amount */}
              <div className="rounded-[28px] bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 p-7 text-white shadow-xl">
                <p className="text-sm uppercase tracking-[0.35em] text-green-100">
                  Total Payable
                </p>

                <div className="mt-3 flex items-center">
                  <IndianRupee className="mr-2 h-8 w-8" />

                  <span className="text-5xl font-black">{totalAmount}</span>
                </div>

                <p className="mt-3 text-green-100">
                  Includes all taxes and booking charges.
                </p>
              </div>

              {/* Trust Section */}
              <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6">
                <h3 className="mb-4 text-lg font-bold text-emerald-700">
                  Why Book With Us?
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
                      ✓
                    </div>

                    <span className="text-slate-700">
                      Secure Booking Process
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
                      ✓
                    </div>

                    <span className="text-slate-700">
                      Instant Booking Confirmation
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
                      ✓
                    </div>

                    <span className="text-slate-700">Transparent Pricing</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
                      ✓
                    </div>

                    <span className="text-slate-700">
                      24×7 Customer Support
                    </span>
                  </div>
                </div>
              </div>

              {/* Confirm Button */}
              <Button
                onClick={confirmBooking}
                disabled={disabled || bookingLoader}
                className="h-16 w-full rounded-2xl bg-slate-900 text-lg font-bold transition-all duration-300 hover:scale-[1.02] hover:bg-slate-800 disabled:cursor-not-allowed"
              >
                {bookingLoader
                  ? "Processing Booking..."
                  : `Confirm Booking • ₹${totalAmount}`}
              </Button>

              <p className="text-center text-sm text-slate-500">
                By confirming, you agree to our Terms & Conditions and Privacy
                Policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
