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
import { useParams, useSearchParams } from "react-router";
import { AppContext } from "@/contexts/AppContextWrapper";

const Checkout = () => {
  const { state } = useContext(AppContext);
  const user = state?.data?.user;
  const name = user?.name ?? "";
  const email = user?.email ?? "";
  const { locationId, vehicleId } = useParams();
  const [searchParams] = useSearchParams();

  const startDate = new Date(searchParams.get("start_date"));
  const toDate = new Date(searchParams.get("to_date"));
  const isGuest = state?.guest ?? false;

  const [loading, setLoading] = useState(false);
  const [checkoutDetails, setCheckoutDetails] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [guestDetails, setGuestDetails] = useState({
    name: "",
    email: "",
  });

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
          <p className="text-lg font-semibold">Unable to load checkout details.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100 py-10 px-5">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-10 text-center text-5xl font-bold text-slate-800">
          Checkout
        </h1>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Vehicle Card */}
          <Card className="overflow-hidden rounded-3xl border-0 shadow-2xl">
            {images.length > 0 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {images.map((img) => (
                    <CarouselItem key={img.id}>
                      <img
                        src={img.image}
                        alt={vehicle?.name}
                        className="h-96 w-full object-cover"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {images.length > 1 && (
                  <>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                  </>
                )}
              </Carousel>
            ) : (
              <div className="flex h-96 items-center justify-center bg-slate-100">
                <Car className="h-24 w-24 text-slate-400" />
              </div>
            )}

            <CardContent className="space-y-6 p-8">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-3xl font-bold">{vehicle?.name}</h2>
                  <p className="mt-1 text-lg text-slate-500">{vehicle?.brand}</p>
                </div>

                <Badge className="bg-green-600 px-3 py-1 text-white">
                  Available
                </Badge>
              </div>

              <p className="rounded-xl bg-slate-100 p-4 leading-7 text-slate-600">
                {vehicle?.description ?? "No description available"}
              </p>

              <Separator />

              <div className="grid grid-cols-2 gap-5">
                <div className="rounded-xl bg-sky-50 p-4">
                  <p className="text-sm text-slate-500">Price / Day</p>

                  <div className="mt-2 flex items-center text-2xl font-bold text-green-600">
                    <IndianRupee size={22} />
                    {vehicle?.price ?? 0}
                  </div>
                </div>

                <div className="rounded-xl bg-indigo-50 p-4">
                  <p className="text-sm text-slate-500">Rental Duration</p>

                  <p className="mt-2 text-2xl font-bold text-indigo-600">
                    {days} Day{days > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Summary */}
          <Card className="rounded-3xl border-0 shadow-2xl">
            <CardContent className="space-y-6 p-8">
              <h2 className="text-3xl font-bold text-slate-800">
                Booking Summary
              </h2>

              <Separator />

              {/* Customer */}
              <div className="flex items-start gap-4">
                <User className="mt-2 text-blue-600" />

                <div className="w-full">
                  <p className="mb-2 text-sm text-slate-500">Customer Name</p>

                  {!isGuest ? (
                    <p className="font-semibold">{name}</p>
                  ) : (
                    <Input
                      placeholder="Enter your name"
                      value={guestDetails.name}
                      onChange={(e) =>
                        setGuestDetails((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <Mail className="mt-2 text-blue-600" />

                <div className="w-full">
                  <p className="mb-2 text-sm text-slate-500">Email Address</p>

                  {!isGuest ? (
                    <p className="font-semibold">{email}</p>
                  ) : (
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      value={guestDetails.email}
                      onChange={(e) =>
                        setGuestDetails((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  )}
                </div>
              </div>

              <Separator />

              {/* Pickup Date */}
              <div className="flex items-start gap-4">
                <CalendarDays className="mt-1 text-blue-600" />

                <div>
                  <p className="text-sm text-slate-500">Pickup Date</p>

                  <p className="font-semibold">
                    {startDate.toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Return Date */}
              <div className="flex items-start gap-4">
                <CalendarDays className="mt-1 text-blue-600" />

                <div>
                  <p className="text-sm text-slate-500">Return Date</p>

                  <p className="font-semibold">{toDate.toLocaleDateString()}</p>
                </div>
              </div>

              {/* Pickup Location */}
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 text-blue-600" />

                <div>
                  <p className="text-sm text-slate-500">Pickup Location</p>

                  <p className="font-semibold">{pickup?.name ?? "-"}</p>

                  <p className="text-sm text-slate-500">
                    {[pickup?.city,pickup?.state].filter(Boolean).join(", ")}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Vehicle</span>

                    <span className="font-semibold">
                      {vehicle?.brand} {vehicle?.name}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-600">Pickup Point</span>

                    <span className="max-w-[220px] text-right font-semibold">
                      {pickup?.name ?? "-"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-600">Rental Duration</span>

                    <span className="font-semibold">
                      {days} Day{days > 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-600">Price / Day</span>

                    <span className="font-semibold">₹{vehicle?.price ?? 0}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-3xl font-bold">
                    <span>Total</span>

                    <span className="text-green-600">₹{totalAmount}</span>
                  </div>
                </div>
              </div>

              <Button className="h-12 w-full rounded-xl bg-blue-600 text-lg hover:bg-blue-700">
                Confirm Booking
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;