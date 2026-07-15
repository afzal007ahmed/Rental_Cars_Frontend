import { api } from "@/api/api";
import { apiRequest } from "@/api/interceptor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Routes } from "@/routes/routes";
import { Loader2, MapPin } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const SearchResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const lat = parseFloat(searchParams.get("lat") || "");
  const long = parseFloat(searchParams.get("long") || "");
 const dropLocationId = searchParams.get('drop_location_id')

  const to = searchParams.get("to_date");
  const from = searchParams.get("start_date");
  const fromTime = searchParams.get("from_time");
  const toTime = searchParams.get("to_time");

  const [loading, setLoading] = useState(false);
  const [warehouses, setWarehouses] = useState([]);

  async function fetchStoreLocations() {
    try {
      setLoading(true);

      const data = await apiRequest.get(
        `${api.Locations}range?lat=${lat}&long=${long}`,
      );

      setWarehouses(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isNaN(lat) && !isNaN(long)) {
      fetchStoreLocations();
    }
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-sky-100 via-white to-indigo-100">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            Nearby Rental Locations
          </h1>

          <p className="mt-3 text-lg text-slate-600">
            Select your preferred pickup location to view available cars.
          </p>
        </div>

        {warehouses && warehouses.length === 0 ? (
          <div className="rounded-xl border bg-white p-12 text-center shadow-lg">
            <MapPin className="mx-auto mb-4 h-12 w-12 text-blue-500" />
            <h2 className="text-xl font-semibold">No nearby locations found</h2>
            <p className="mt-2 text-slate-500">
              Try searching in a different area.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 overflow-y-auto">
            {warehouses &&
              warehouses.map((warehouse) => (
                <Card
                  key={warehouse.id}
                  className={`overflow-hidden rounded-2xl border-0 bg-white shadow-lg transition-all duration-300 ${
                    warehouse.active
                      ? "hover:-translate-y-2 hover:shadow-2xl"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="h-2 bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500" />

                  <div className="space-y-5 p-6">
                    <div className="flex justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-slate-800">
                          {warehouse.name}
                        </h2>

                        <div className="mt-2 flex items-center gap-2 text-slate-500">
                          <MapPin className="h-4 w-4 text-red-500" />
                          <span>
                            {warehouse.city}, {warehouse.state}
                          </span>
                        </div>
                      </div>

                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                        {Number(warehouse.distance).toFixed(1)} km
                      </Badge>
                    </div>

                    <Button
                      disabled={!warehouse.active}
                      className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:from-blue-700 hover:to-violet-700"
                      onClick={() => {
                        const params = new URLSearchParams({
                          start_date: from,
                          to_date: to,
                          from_time: fromTime,
                          to_time: toTime,
                          drop_location_id : dropLocationId
                        });

                        navigate(
                          `${Routes.Store.slice(0, Routes.Store.length - 3)}/${warehouse.id}?${params.toString()}`,
                        );
                      }}
                    >
                      View Available Cars
                    </Button>
                  </div>
                </Card>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResult;
