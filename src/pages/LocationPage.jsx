import { api } from "@/api/api";
import { apiRequest } from "@/api/interceptor";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Car, IndianRupee, Package } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { Routes } from "@/routes/routes";
import { formatDate } from "@/utils/dateFormater";

const LocationPage = () => {
  const navigate = useNavigate();
  const { id: locationId } = useParams();
  const [searchParams] = useSearchParams();

  const startDate = searchParams.get("start_date");
  const toDate = searchParams.get("to_date");
  const startTime = searchParams.get("from_time");
  const endTime = searchParams.get("to_time");
  const dropLocationId = searchParams.get("drop_location_id");

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [images, setImages] = useState({});

  async function findAllVehiclesPresent() {
    try {
      setLoading(true);

      const response = await apiRequest.get(
        `${api.Locations}${locationId}?start_date=${startDate}&to_date=${toDate}&start_time=${startTime}&end_time=${endTime}`,
      );

      setData(response.data);
      setImages(response.images || {});
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (locationId && startDate && toDate) {
      findAllVehiclesPresent();
    }
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-xl font-semibold">
        Loading vehicles...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-black">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-20" />

        <div className="relative mx-auto max-w-7xl px-6 py-16">
          <h1 className="text-5xl font-black text-white">
            Find Your Perfect Ride
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            Browse premium vehicles available for your selected dates and book
            instantly.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <div className="rounded-2xl bg-white/10 px-6 py-4 backdrop-blur-md">
              <p className="text-sm text-slate-300">Pickup</p>

              <p className="text-xl font-semibold text-white">
                {new Date(startDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 px-6 py-4 backdrop-blur-md">
              <p className="text-sm text-slate-300">Return</p>

              <p className="text-xl font-semibold text-white">{toDate}</p>
            </div>

            <div className="rounded-2xl bg-white/10 px-6 py-4 backdrop-blur-md">
              <p className="text-sm text-slate-300">Total Brands/Models</p>

              <p className="text-xl font-semibold text-white">{data.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        {data.length === 0 ? (
          <div className="rounded-3xl bg-white py-24 text-center shadow-lg">
            <Car className="mx-auto mb-6 h-20 w-20 text-slate-400" />

            <h2 className="text-3xl font-bold text-slate-700">
              No Vehicles Available
            </h2>

            <p className="mt-3 text-slate-500">
              Try selecting different booking dates.
            </p>
          </div>
        ) : (
          <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
            {data.map((item) => {
              const vehicleImages = images[item.vehicle.id] || [];

              return (
                <Card
                  key={item.id}
                  className="group overflow-hidden rounded-3xl border-0 bg-white shadow-lg transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
                >
                  {vehicleImages.length > 0 ? (
                    <div className="relative">
                      <Carousel className="w-full">
                        <CarouselContent>
                          {vehicleImages.map((image, index) => (
                            <CarouselItem key={index}>
                              <div className="relative h-80 overflow-hidden">
                                <img
                                  src={image}
                                  alt={`${item.vehicle.name}-${index}`}
                                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                                <div className="absolute left-6 bottom-6">
                                  <h2 className="text-3xl font-bold text-white">
                                    {item.vehicle.brand}
                                  </h2>

                                  <p className="text-lg text-white/90">
                                    {item.vehicle.name}
                                  </p>
                                </div>

                                <div className="absolute left-5 top-5">
                                  <Badge
                                    className={
                                      item.status === "available"
                                        ? "bg-green-600 text-white"
                                        : "bg-red-600 text-white"
                                    }
                                  >
                                    {item.status}
                                  </Badge>
                                </div>

                                <div className="absolute right-5 top-5">
                                  <Badge className="bg-white text-black shadow-lg">
                                    ₹{item.vehicle.price}/day
                                  </Badge>
                                </div>

                                <div className="absolute bottom-5 right-5">
                                  <Badge className="bg-black/50 backdrop-blur-md text-white">
                                    {index + 1} / {vehicleImages.length}
                                  </Badge>
                                </div>
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>

                        {vehicleImages.length > 1 && (
                          <>
                            <CarouselPrevious className="left-4 border-0 bg-white/80 backdrop-blur-md shadow-lg" />
                            <CarouselNext className="right-4 border-0 bg-white/80 backdrop-blur-md shadow-lg" />
                          </>
                        )}
                      </Carousel>
                    </div>
                  ) : (
                    <div className="flex h-80 items-center justify-center bg-slate-200">
                      <Car className="h-24 w-24 text-slate-400" />
                    </div>
                  )}
                  <CardContent className="space-y-6 p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl bg-slate-100 p-4">
                        <p className="text-sm text-slate-500">Price</p>

                        <p className="mt-1 text-3xl font-black text-blue-700">
                          ₹{item.vehicle.price}
                        </p>

                        <p className="text-sm text-slate-500">Per Day</p>
                      </div>

                      <div className="rounded-2xl bg-slate-100 p-4">
                        <p className="text-sm text-slate-500">Available</p>

                        <p className="mt-1 text-3xl font-black text-green-600">
                          {item.available_units}
                        </p>

                        <p className="text-sm text-slate-500">Cars</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                      <div className="rounded-xl bg-slate-100 p-3 text-center">
                        <Car className="mx-auto mb-2 h-5 w-5 text-slate-700" />
                        <p className="text-xs font-medium">Vehicle</p>
                      </div>

                      <div className="rounded-xl bg-slate-100 p-3 text-center">
                        <Package className="mx-auto mb-2 h-5 w-5 text-slate-700" />
                        <p className="text-xs font-medium">
                          {item.units} Units
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-100 p-3 text-center">
                        <IndianRupee className="mx-auto mb-2 h-5 w-5 text-slate-700" />
                        <p className="text-xs font-medium">Affordable</p>
                      </div>

                      <div className="rounded-xl bg-slate-100 p-3 text-center">
                        <Car className="mx-auto mb-2 h-5 w-5 text-slate-700" />
                        <p className="text-xs font-medium">Premium</p>
                      </div>
                    </div>

                    <p className="line-clamp-3 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
                      {item.vehicle.description}
                    </p>

                    <Button
                      onClick={() => {
                        const params = new URLSearchParams({
                          start_date: startDate,
                          to_date: toDate,
                          start_time: startTime,
                          end_time: endTime,
                          ...(dropLocationId && {
                            drop_location_id: dropLocationId,
                          }),
                        });

                        navigate(
                          `${Routes.Checkout}/${locationId}/${item.vehicle.id}?${params.toString()}`,
                        );
                      }}
                      disabled={item.status !== "available"}
                      className="h-14 w-full rounded-2xl bg-black text-lg font-semibold transition-all hover:bg-slate-800"
                    >
                      {item.status === "available" ? "Book Now" : "Unavailable"}
                    </Button>
                  </CardContent>{" "}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPage;
