import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarIcon, MapPin, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import axios from "axios";
import { api } from "@/api/api";
import { debounce } from "@/utils/debounce";
import { useNavigate } from "react-router";
import { Routes } from "@/routes/routes";

export default function SearchPage() {
  const [from, setFrom] = useState("");
  const [open, setOpen] = useState(false);
  const coords = useRef({
    long: null,
    lat: null,
  });
  const nav = useNavigate();
  const foundLocation = useRef(false);
  const [to, setTo] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState(null);

  const currDate = new Date();

  const disabled = !foundLocation.current || !to || !from;

  async function fetchLocations() {
    setLoading(true);
    const data = await axios.get(api.OpenStreetMap + `&q=${search}`);
    setLocations(data.data);
    setLoading(false);
  }

  const debounceFn = useCallback(debounce(1), []);

  useEffect(() => {
    if (search.trim().length && !foundLocation.current) {
      debounceFn(fetchLocations);
    }
  }, [search]);

  useEffect(() => {
    if (search.trim().length > 0 && !foundLocation.current) {
      setOpen(true);
    }
  }, [search]);

  return (
    <div className="h-full bg-gradient-to-br from-sky-50 via-white to-indigo-100 p-8">
      <Card className="mx-auto max-w-4xl rounded-3xl border-0 bg-white/90 p-10 shadow-2xl backdrop-blur">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900">
            Find Your Perfect Ride
          </h1>

          <p className="mt-3 text-slate-500">
            Search vehicles available near you.
          </p>
        </div>

        <div className="relative">
          <Input
            placeholder="Enter city"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              foundLocation.current = false;
            }}
            className="h-12"
          />

          {open && (
            <div className="absolute z-50 mt-2 w-full rounded-xl border bg-background shadow-lg">
              <Command shouldFilter={false}>
                <CommandList className="max-h-72">
                  {loading ? (
                    <div className="flex items-center justify-center gap-2 py-6">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                      <span>Searching...</span>
                    </div>
                  ) : locations?.length ? (
                    <CommandGroup>
                      {locations.map((location) => (
                        <CommandItem
                          key={location.place_id}
                          onSelect={() => {
                            coords.current = {
                              lat: location.lat,
                              long: location.lon,
                            };
                            foundLocation.current = true;
                            setSearch(location.display_name);
                            setOpen(false);
                          }}
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          {location.display_name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ) : (
                    <CommandEmpty>No locations found.</CommandEmpty>
                  )}
                </CommandList>
              </Command>
            </div>
          )}
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              From
            </label>

            <Popover>
              <PopoverTrigger asChild className="w-full">
                <Button
                  variant="outline"
                  className="h-12 justify-between w-full rounded-xl"
                >
                  {from ? from.toLocaleString() : "Select date"}
                  <CalendarIcon className="h-4 w-4 text-slate-500" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={from}
                  onSelect={(date) => {
                    if ((to && date >= to) || currDate > date) {
                      toast.error("please select a valid date range.", {
                        position: "bottom-center",
                      });
                      return;
                    }
                    setFrom(date);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex-1">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              To
            </label>

            <Popover>
              <PopoverTrigger asChild className="w-full">
                <Button
                  variant="outline"
                  className="h-12 w-full justify-between rounded-xl"
                >
                  {to ? to.toLocaleString() : "Select date"}

                  <CalendarIcon className="h-4 w-4 text-slate-500" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={to}
                  onSelect={(date) => {
                    if ((from && date <= from) || currDate > date) {
                      toast.error("please select a valid date range.", {
                        position: "bottom-center",
                      });
                      return;
                    }
                    setTo(date);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            size="lg"
            disabled={disabled}
            onClick={() => {
              const params = new URLSearchParams({
                start_date: from.toISOString().split("T")[0],
                to_date: to.toISOString().split("T")[0],
              });

              nav(
                Routes.SearchResult +
                  "?" +
                  `long=${coords.current.long}&lat=${coords.current.lat}&name=${search}&${params.toString()}`,
              );
            }}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-10 py-6 text-base shadow-lg transition hover:scale-105 hover:from-blue-700 hover:to-indigo-700"
          >
            <Search className="mr-2 h-5 w-5" />
            Search Vehicles
          </Button>
        </div>
      </Card>
    </div>
  );
}
