import { api } from "@/api/api";
import { apiRequest } from "@/api/interceptor";
import { Routes } from "@/routes/routes";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  BadgeCheck,
  CalendarDays,
  Car,
  Clock3,
  Loader2,
  Mail,
  MapPin,
  ReceiptIndianRupee,
  User,
  IndianRupee,
  Timer,
  CalendarClock,
} from "lucide-react";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useNavigate, useParams } from "react-router";

// ==========================
// Reusable Components
// ==========================

const InfoCard = ({ icon: Icon, title, value }) => (
  <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl">
    <CardContent className="flex items-start gap-4 p-5">
      <div className="rounded-xl bg-primary/10 p-3">
        <Icon className="h-5 w-5 text-primary" />
      </div>

      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{title}</p>

        <p className="mt-1 text-base font-semibold leading-relaxed break-words">
          {value}
        </p>
      </div>
    </CardContent>
  </Card>
);

const SummaryCard = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border bg-white p-5 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="rounded-lg bg-primary/10 p-2">
        <Icon className="h-5 w-5 text-primary" />
      </div>

      <div>
        <p className="text-sm text-muted-foreground">{label}</p>

        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  </div>
);

// ==========================
// Helpers
// ==========================

const safeValue = (value, fallback = "N/A") => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return value;
};

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatTime = (time) => {
  if (!time) return "N/A";

  return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const calculateRentalDays = (start, end) => {
  if (!start || !end) return 0;

  const startDate = new Date(start);

  const endDate = new Date(end);

  const difference = endDate.getTime() - startDate.getTime();

  return Math.max(1, Math.ceil(difference / (1000 * 60 * 60 * 24)));
};

// ==========================
// Page
// ==========================

const Confirm = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);

  const [loading, setLoading] = useState(true);

  const getBooking = useCallback(async () => {
    try {
      const response = await apiRequest.get(`${api.Bookings}/${id}`);

      setBooking(response);
    } catch (error) {
      console.error("Booking fetch failed", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) getBooking();
  }, [id, getBooking]);

  const rentalDays = useMemo(() => {
    if (!booking) return 0;

    return calculateRentalDays(booking.start_date, booking.to_date);
  }, [booking]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2
          className="
          h-10 w-10 
          animate-spin 
          text-primary
          "
        />
      </div>
    );
  }

  if (!booking) {
    return (
      <div
        className="
      flex 
      min-h-screen 
      items-center 
      justify-center 
      text-lg 
      font-semibold
      "
      >
        Booking not found.
      </div>
    );
  }

  return (
    <div
      className="
min-h-screen 
bg-gradient-to-br 
from-slate-50 
via-blue-50 
to-indigo-100 
py-10 
px-4
"
    >
      <div
        className="
mx-auto 
max-w-6xl 
space-y-8
"
      >
        {/* HERO SECTION */}
        <Card
          className="
overflow-hidden 
border-0 
shadow-2xl 
rounded-3xl
"
        >
          <div
            className="
bg-gradient-to-r 
from-emerald-500 
via-green-600 
to-teal-600 
px-8 
py-12
"
          >
            <div
              className="
flex 
flex-col 
items-center 
text-center
"
            >
              <div
                className="
rounded-full 
bg-white/20 
p-5 
backdrop-blur
"
              >
                <BadgeCheck
                  className="
h-16 
w-16 
text-white
"
                />
              </div>

              <Badge
                className="
mt-6 
bg-white 
text-emerald-700 
hover:bg-white
"
              >
                {safeValue(booking.status, "unknown").toUpperCase()}
              </Badge>

              <h1
                className="
mt-5 
text-4xl 
font-bold 
text-white
"
              >
                Booking Confirmed
              </h1>

              <p
                className="
mt-3 
max-w-2xl 
text-lg 
text-green-100
"
              >
                Your{" "}
                <span className="font-semibold">
                  {booking.vehicle
                    ? `${booking.vehicle.brand} ${booking.vehicle.name}`
                    : "vehicle"}
                </span>{" "}
                has been reserved successfully.
              </p>

              <p
                className="
mt-2 
text-green-200 
text-sm
"
              >
                Booking Reference
              </p>

              <p
                className="
font-mono 
text-lg 
text-white 
tracking-wider
"
              >
                {booking.id ? booking.id.slice(0, 8).toUpperCase() : "N/A"}
              </p>
            </div>
          </div>
        </Card>
        {/* TOTAL PRICE */}
        <Card
          className="
border-0 
rounded-3xl 
shadow-xl
"
        >
          <CardContent className="p-8">
            <div className="text-center">
              <p
                className="
text-muted-foreground 
text-lg
"
              >
                Total Rental Cost
              </p>

              <h2
                className="
mt-3 
text-6xl 
font-extrabold 
tracking-tight
"
              >
                ₹{Number(booking.total_price ?? 0).toLocaleString()}
              </h2>

              <p
                className="
mt-3 
text-muted-foreground
"
              >
                ₹
                {Number(
                  booking.vehicle?.price ?? booking.vehicle_price ?? 0,
                ).toLocaleString()}
                / day × {rentalDays} {rentalDays === 1 ? "day" : "days"}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card
          className="
border-0 
rounded-3xl 
shadow-lg
"
        >
          <CardContent className="p-8">
            <div
              className="
flex 
items-center 
gap-4 
mb-8
"
            >
              <div
                className="
rounded-2xl 
bg-primary/10 
p-4
"
              >
                <Car
                  className="
h-8 
w-8 
text-primary
"
                />
              </div>

              <div>
                <h2
                  className="
text-2xl 
font-bold
"
                >
                  Vehicle Details
                </h2>

                <p
                  className="
text-muted-foreground
"
                >
                  Information about your reserved vehicle
                </p>
              </div>
            </div>

            <div
              className="
grid 
gap-5 
md:grid-cols-2
"
            >
              <InfoCard
                icon={Car}
                title="Vehicle"
                value={
                  booking.vehicle
                    ? `${booking.vehicle.brand} ${booking.vehicle.name}`
                    : "Vehicle unavailable"
                }
              />

              <InfoCard
                icon={CalendarClock}
                title="Category"
                value={
                  booking.vehicle?.description ?? "No description available"
                }
              />

              <InfoCard
                icon={IndianRupee}
                title="Daily Rental"
                value={
                  booking.vehicle?.price || booking.vehicle_price
                    ? `₹${Number(
                        booking.vehicle?.price ?? booking.vehicle_price,
                      ).toLocaleString()} / day`
                    : "Price unavailable"
                }
              />

              <InfoCard
                icon={Timer}
                title="Rental Duration"
                value={`${rentalDays} ${rentalDays === 1 ? "Day" : "Days"}`}
              />
            </div>
          </CardContent>
        </Card>
        <Card
          className="
border-0 
rounded-3xl 
shadow-lg
"
        >
          <CardContent className="p-8">
            <div
              className="
mb-8 
flex 
items-center 
gap-4
"
            >
              <div
                className="
rounded-2xl 
bg-primary/10 
p-4
"
              >
                <CalendarDays
                  className="
h-8 
w-8 
text-primary
"
                />
              </div>

              <div>
                <h2
                  className="
text-2xl 
font-bold
"
                >
                  Trip Details
                </h2>

                <p
                  className="
text-muted-foreground
"
                >
                  Pickup and return schedule
                </p>
              </div>
            </div>

            <div
              className="
grid 
gap-5 
md:grid-cols-2
"
            >
              <InfoCard
                icon={CalendarDays}
                title="Pickup Date"
                value={formatDate(booking.start_date)}
              />

              <InfoCard
                icon={Clock3}
                title="Pickup Time"
                value={formatTime(booking.start_time)}
              />

              <InfoCard
                icon={CalendarDays}
                title="Return Date"
                value={formatDate(booking.to_date)}
              />

              <InfoCard
                icon={Clock3}
                title="Return Time"
                value={formatTime(booking.end_time)}
              />
            </div>
          </CardContent>
        </Card>
        <Card
          className="
border-0 
rounded-3xl 
shadow-lg
"
        >
          <CardContent className="p-8">
            <div
              className="
mb-8 
flex 
items-center 
gap-4
"
            >
              <div
                className="
rounded-2xl 
bg-primary/10 
p-4
"
              >
                <ReceiptIndianRupee
                  className="
h-8 
w-8 
text-primary
"
                />
              </div>

              <div>
                <h2
                  className="
text-2xl 
font-bold
"
                >
                  Rental Summary
                </h2>

                <p
                  className="
text-muted-foreground
"
                >
                  Quick overview of your booking
                </p>
              </div>
            </div>

            <div
              className="
grid 
gap-5 
md:grid-cols-2 
lg:grid-cols-4
"
            >
              <SummaryCard
                icon={Timer}
                label="Duration"
                value={`${rentalDays} Days`}
              />

              <SummaryCard
                icon={IndianRupee}
                label="Daily Price"
                value={`₹${Number(
                  booking.vehicle?.price ?? booking.vehicle_price ?? 0,
                ).toLocaleString()}`}
              />

              <SummaryCard
                icon={ReceiptIndianRupee}
                label="Total Paid"
                value={`₹${Number(booking.total_price ?? 0).toLocaleString()}`}
              />

              <SummaryCard
                icon={BadgeCheck}
                label="Status"
                value={safeValue(booking.status, "N/A")}
              />
            </div>
          </CardContent>
        </Card>
        <Card
          className="
border-0 
rounded-3xl 
shadow-lg
"
        >
          <CardContent className="p-8">
            <div
              className="
mb-8 
flex 
items-center 
gap-4
"
            >
              <div
                className="
rounded-2xl 
bg-primary/10 
p-4
"
              >
                <MapPin
                  className="
h-8 
w-8 
text-primary
"
                />
              </div>

              <div>
                <h2
                  className="
text-2xl 
font-bold
"
                >
                  Pickup Location
                </h2>

                <p
                  className="
text-muted-foreground
"
                >
                  Collect your vehicle from this location
                </p>
              </div>
            </div>

            <div
              className="
grid 
gap-5 
md:grid-cols-2
"
            >
              <InfoCard
                icon={MapPin}
                title="Terminal"
                value={
                  booking.pickupLocation?.name ?? "Pickup location unavailable"
                }
              />

              <InfoCard
                icon={MapPin}
                title="City"
                value={
                  booking.pickupLocation
                    ? `${booking.pickupLocation.city}, ${booking.pickupLocation.state}`
                    : "N/A"
                }
              />
            </div>
          </CardContent>
        </Card>
        <Card
          className="
border-0 
rounded-3xl 
shadow-lg
"
        >
          <CardContent className="p-8">
            <div
              className="
mb-8 
flex 
items-center 
gap-4
"
            >
              <div
                className="
rounded-2xl 
bg-primary/10 
p-4
"
              >
                <MapPin
                  className="
h-8 
w-8 
text-primary
"
                />
              </div>

              <div>
                <h2
                  className="
text-2xl 
font-bold
"
                >
                  Drop Location
                </h2>

                <p
                  className="
text-muted-foreground
"
                >
                  Vehicle return location
                </p>
              </div>
            </div>

            <div
              className="
grid 
gap-5 
md:grid-cols-2
"
            >
              <InfoCard
                icon={MapPin}
                title="Terminal"
                value={
                  booking.dropLocation?.name ?? "Drop location unavailable"
                }
              />

              <InfoCard
                icon={MapPin}
                title="City"
                value={
                  booking.dropLocation
                    ? `${booking.dropLocation.city}, ${booking.dropLocation.state}`
                    : "N/A"
                }
              />
            </div>
          </CardContent>
        </Card>
        <Card
          className="
border-0 
rounded-3xl 
shadow-lg
"
        >
          <CardContent className="p-8">
            <div
              className="
mb-8 
flex 
items-center 
gap-4
"
            >
              <div
                className="
rounded-2xl 
bg-primary/10 
p-4
"
              >
                <User
                  className="
h-8 
w-8 
text-primary
"
                />
              </div>

              <div>
                <h2
                  className="
text-2xl 
font-bold
"
                >
                  Customer Details
                </h2>

                <p
                  className="
text-muted-foreground
"
                >
                  Booking owner information
                </p>
              </div>
            </div>

            <div
              className="
grid 
gap-5 
md:grid-cols-2
"
            >
              <InfoCard
                icon={User}
                title="Customer Name"
                value={
                  booking.guest_name ?? booking.user?.name ?? "Guest Customer"
                }
              />

              <InfoCard
                icon={Mail}
                title="Email Address"
                value={
                  booking.guest_email ??
                  booking.user?.email ??
                  "No email available"
                }
              />
            </div>
          </CardContent>
        </Card>
        <Card
          className="
border-0 
rounded-3xl 
shadow-lg
"
        >
          <CardContent className="p-8">
            <div
              className="
mb-8 
flex 
items-center 
gap-4
"
            >
              <div
                className="
rounded-2xl 
bg-primary/10 
p-4
"
              >
                <ReceiptIndianRupee
                  className="
h-8 
w-8 
text-primary
"
                />
              </div>

              <div>
                <h2
                  className="
text-2xl 
font-bold
"
                >
                  Booking Reference
                </h2>

                <p
                  className="
text-muted-foreground
"
                >
                  Keep these details for future reference
                </p>
              </div>
            </div>

            <div
              className="
space-y-6 
rounded-2xl 
border 
bg-slate-50 
p-6
"
            >
              <div>
                <p
                  className="
text-sm 
text-muted-foreground
"
                >
                  Booking ID
                </p>

                <p
                  className="
mt-2 
break-all 
rounded-lg 
bg-white 
p-4 
font-mono 
text-sm 
shadow-sm
"
                >
                  {booking.id}
                </p>
              </div>

              <Separator />

              <div
                className="
grid 
gap-6 
md:grid-cols-2
"
              >
                <div>
                  <p
                    className="
text-sm 
text-muted-foreground
"
                  >
                    Booking Created
                  </p>

                  <p
                    className="
mt-2 
font-semibold
"
                  >
                    {booking.createdAt ? formatDate(booking.createdAt) : "N/A"}
                  </p>
                </div>

                <div>
                  <p
                    className="
text-sm 
text-muted-foreground
"
                  >
                    Last Updated
                  </p>

                  <p
                    className="
mt-2 
font-semibold
"
                  >
                    {booking.updatedAt ? formatDate(booking.updatedAt) : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className="
border-0 
rounded-3xl 
shadow-lg
"
        >
          <CardContent
            className="
flex 
flex-col 
items-center 
gap-6 
p-8
"
          >
            <div className="text-center">
              <BadgeCheck
                className="
mx-auto 
mb-4 
h-12 
w-12 
text-emerald-600
"
              />

              <h2
                className="
text-2xl 
font-bold
"
              >
                Thank You!
              </h2>

              <p
                className="
mt-2 
max-w-xl 
text-muted-foreground
"
              >
                Your booking has been successfully confirmed. Please arrive at
                the pickup location on time with a valid driving licence and a
                government-issued ID.
              </p>
            </div>

            <div
              className="
flex 
w-full 
flex-col 
gap-4 
md:flex-row
"
            >
              <Button
                className="
h-12 
flex-1
"
                onClick={() => navigate(Routes.Home)}
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Confirm;
