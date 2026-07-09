import { api } from "@/api/api";
import { apiRequest } from "@/api/interceptor";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Routes } from "@/routes/routes";

const InfoCard = ({ icon: Icon, title, value }) => (
  <Card className="border shadow-sm hover:shadow-md transition-all">
    <CardContent className="flex items-start gap-4 p-5">
      <div className="rounded-xl bg-primary/10 p-3">
        <Icon className="h-5 w-5 text-primary" />
      </div>

      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="mt-1 font-semibold break-all">{value}</p>
      </div>
    </CardContent>
  </Card>
);

const Confirm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const getBooking = useCallback(async () => {
    try {
      const data  = await apiRequest.get(`${api.Bookings}/${id}`);
      setBooking(data);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      getBooking();
    }
  }, [id, getBooking]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Booking not found.
      </div>
    );
  }

  const pickup = new Date(booking.start_date);
  const drop = new Date(booking.to_date);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-10 px-4">
      <div className="mx-auto max-w-5xl">

        {/* Hero */}

        <Card className="overflow-hidden border-0 shadow-2xl">

          <div className="bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 px-8 py-12">

            <div className="flex flex-col items-center text-center">

              <div className="rounded-full bg-white/20 p-5 backdrop-blur">
                <BadgeCheck className="h-16 w-16 text-white" />
              </div>

              <h1 className="mt-6 text-4xl font-bold text-white">
                Booking Confirmed
              </h1>

              <p className="mt-3 max-w-2xl text-green-100">
                Thank you for choosing us. Your vehicle has been reserved
                successfully and is ready for pickup on your selected date.
              </p>

            </div>
          </div>

          <CardContent className="space-y-10 p-8">

            {/* Price */}

            <div className="rounded-2xl bg-primary text-primary-foreground p-8 text-center shadow-lg">

              <p className="text-lg opacity-80">
                Total Amount
              </p>

              <h2 className="mt-2 text-5xl font-bold">
                ₹{Number(booking.total_price).toLocaleString()}
              </h2>

            </div>

            {/* Booking */}

            <div>

              <h2 className="mb-5 text-2xl font-bold">
                Booking Information
              </h2>

              <div className="grid gap-5 md:grid-cols-2">

                <InfoCard
                  icon={CalendarDays}
                  title="Pickup Date"
                  value={pickup.toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                />

                <InfoCard
                  icon={CalendarDays}
                  title="Return Date"
                  value={drop.toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                />

                <InfoCard
                  icon={MapPin}
                  title="Pickup Hub"
                  value={booking.location.name}
                />

                <InfoCard
                  icon={MapPin}
                  title="City"
                  value={`${booking.location.city}, ${booking.location.state}`}
                />

                <InfoCard
                  icon={Car}
                  title="Vehicle ID"
                  value={booking.vehicle_id}
                />

                <InfoCard
                  icon={Clock3}
                  title="Status"
                  value={booking.status.toUpperCase()}
                />

              </div>

            </div>

            <Separator />

            {/* Guest */}

            {(booking.guest_name || booking.guest_email) && (
              <div>

                <h2 className="mb-5 text-2xl font-bold">
                  Guest Details
                </h2>

                <div className="grid gap-5 md:grid-cols-2">

                  <InfoCard
                    icon={User}
                    title="Guest Name"
                    value={booking.guest_name}
                  />

                  <InfoCard
                    icon={Mail}
                    title="Guest Email"
                    value={booking.guest_email}
                  />

                </div>

              </div>
            )}

            <Separator />

            {/* Reference */}

            <Card className="border-dashed">

              <CardContent className="p-6">

                <div className="flex items-start gap-4">

                  <div className="rounded-xl bg-primary/10 p-3">
                    <ReceiptIndianRupee className="text-primary h-6 w-6" />
                  </div>

                  <div>

                    <h3 className="font-semibold text-lg">
                      Booking Reference
                    </h3>

                    <p className="mt-2 font-mono break-all text-sm">
                      {booking.id}
                    </p>

                    <p className="mt-4 text-sm text-muted-foreground">
                      Created on{" "}
                      {new Date(
                        booking.createdAt
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>

                  </div>

                </div>

              </CardContent>

            </Card>

            {/* Buttons */}

            <div className="flex flex-col gap-4 md:flex-row">

              <Button
                className="h-12 flex-1 text-base"
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