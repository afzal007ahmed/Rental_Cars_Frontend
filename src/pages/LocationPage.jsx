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

const LocationPage = () => {
  const navigate = useNavigate() ;
  const { id: locationId } = useParams();
  const [searchParams] = useSearchParams();

  const startDate = new Date(searchParams.get("start_date"));
  const toDate = new Date(searchParams.get("to_date"));

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [images, setImages] = useState({});

  async function findAllVehiclesPresent() {
    try {
      setLoading(true);

      const response = await apiRequest.get(
        `${api.Locations}${locationId}?start_date=${startDate}&to_date=${toDate}`,
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
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100 py-10 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold text-slate-800">
            Available Cars
          </h1>

          <p className="mt-3 text-lg text-slate-500">
            Choose the perfect vehicle for your journey
          </p>
        </div>

        {data.length === 0 ? (
          <div className="mt-20 text-center text-2xl font-semibold text-slate-500">
            No vehicles available for the selected dates.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {data.map((item) => {
              const vehicleImages = images[item.vehicle.id] || [];

              return (
                <Card
                  key={item.id}
                  className="overflow-hidden rounded-3xl border-0 bg-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
                  {vehicleImages.length > 0 ? (
                    <Carousel className="w-full">
                      <CarouselContent>
                        {vehicleImages.map((image, index) => (
                          <CarouselItem key={index}>
                            <img
                              src={image}
                              alt={`${item.vehicle.name}-${index}`}
                              className="h-60 w-full object-cover"
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>

                      {vehicleImages.length > 1 && (
                        <>
                          <CarouselPrevious className="left-3" />
                          <CarouselNext className="right-3" />
                        </>
                      )}
                    </Carousel>
                  ) : (
                    <div className="flex h-60 items-center justify-center bg-slate-200">
                      <Car className="h-20 w-20 text-slate-500" />
                    </div>
                  )}

                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                    <Car className="mb-4 h-10 w-10 text-white" />

                    <CardTitle className="text-3xl text-white">
                      {item.vehicle.name}
                    </CardTitle>

                    <p className="mt-1 text-blue-100">{item.vehicle.brand}</p>
                  </div>

                  <CardContent className="space-y-5 p-6">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 font-medium text-gray-600">
                        <IndianRupee size={18} />
                        Price / Day
                      </span>

                      <span className="text-2xl font-bold text-green-600">
                        ₹{item.vehicle.price}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 font-medium text-gray-600">
                        <Package size={18} />
                        Available Units
                      </span>

                      <span className="text-lg font-bold">
                        {item.availabile_units}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge
                        className={
                          item.status === "available"
                            ? "bg-green-600 hover:bg-green-600"
                            : "bg-red-600 hover:bg-red-600"
                        }
                      >
                        {item.status}
                      </Badge>

                      <Badge variant="outline">
                        Total Units : {item.units}
                      </Badge>
                    </div>

                    <p className="rounded-xl bg-slate-100 p-3 text-sm text-slate-600">
                      {item.vehicle.description}
                    </p>

                    <Button
                      onClick={() => {
                        const params = new URLSearchParams({
                          start_date: startDate.toISOString().split("T")[0],
                          to_date: toDate.toISOString().split("T")[0],
                        });

                        navigate(
                          `${Routes.Checkout}/${locationId}/${item.vehicle.id}?${params.toString()}`,
                        );
                      }}
                      disabled={item.status !== "available"}
                      className="w-full rounded-xl bg-blue-600 text-lg hover:bg-blue-700"
                    >
                      {item.status === "available" ? "Book Now" : "Sold Out"}
                    </Button>
                  </CardContent>
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
