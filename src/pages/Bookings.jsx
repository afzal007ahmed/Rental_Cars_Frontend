import { api } from "@/api/api";
import { apiRequest } from "@/api/interceptor";
import React, { useEffect, useState } from "react";
import {
  Loader2,
  CalendarDays,
  MapPin,
  ReceiptIndianRupee,
  Car,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const statusColor = {
  inprogress: "bg-blue-500",
  completed: "bg-green-600",
  cancelled: "bg-red-500",
};

const Bookings = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);

  async function getAllBookings() {
    try {
      setLoading(true);

      const response = await apiRequest.get(api.Bookings + "/user");

      setBookings(response);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10">
      <div className="mx-auto max-w-6xl px-4">

        <div className="mb-8">
          <h1 className="text-4xl font-bold">My Bookings</h1>
          <p className="text-muted-foreground mt-2">
            View all your vehicle reservations.
          </p>
        </div>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <h2 className="text-xl font-semibold">
                No bookings found
              </h2>

              <p className="mt-2 text-muted-foreground">
                You haven't booked any vehicles yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {bookings.map((booking) => (
              <Card
                key={booking.id}
                className="transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <CardHeader>

                  <div className="flex items-center justify-between">

                    <CardTitle className="text-lg">
                      {booking.location.name}
                    </CardTitle>

                    <Badge
                      className={`${statusColor[booking.status]} capitalize`}
                    >
                      {booking.status}
                    </Badge>

                  </div>

                  <p className="text-sm text-muted-foreground">
                    {booking.location.city}, {booking.location.state}
                  </p>

                </CardHeader>

                <CardContent className="space-y-4">

                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-primary" />

                    <div>
                      <p className="text-sm text-muted-foreground">
                        Pickup
                      </p>

                      <p className="font-medium">
                        {new Date(
                          booking.start_date
                        ).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-primary" />

                    <div>
                      <p className="text-sm text-muted-foreground">
                        Return
                      </p>

                      <p className="font-medium">
                        {new Date(
                          booking.to_date
                        ).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <ReceiptIndianRupee className="h-5 w-5 text-primary" />

                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Amount
                      </p>

                      <p className="font-bold text-lg">
                        ₹{booking.total_price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />

                    <div>
                      <p className="text-sm text-muted-foreground">
                        Pickup Hub
                      </p>

                      <p className="font-medium">
                        {booking.location.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Car className="h-5 w-5 text-primary" />

                    <div>
                      <p className="text-sm text-muted-foreground">
                        Booking ID
                      </p>

                      <p className="font-mono text-xs break-all">
                        {booking.id}
                      </p>
                    </div>
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