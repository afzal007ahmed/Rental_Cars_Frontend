import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CalendarIcon, MapPin, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";
import axios from "axios";

import { api } from "@/api/api";
import { apiRequest } from "@/api/interceptor";
import { debounce } from "@/utils/debounce";
import { useNavigate } from "react-router";
import { Routes } from "@/routes/routes";
import { formatDate } from "@/utils/dateFormater";
import { formatTime } from "@/utils/timeFormater";

export default function SearchPage() {
  const nav = useNavigate();

  // Pickup coordinates
  const coords = useRef({
    lat: null,
    long: null,
  });

  // Drop coordinates
  const dropCoords = useRef({
    lat: null,
    long: null,
  });

  const foundLocation = useRef(false);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);

  const [open, setOpen] = useState(false);

  const [differentDropLocation, setDifferentDropLocation] = useState(false);

  const [dropLocations, setDropLocations] = useState([]);
  const [selectedDropLocation, setSelectedDropLocation] = useState("");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [fromHour, setFromHour] = useState("12");
  const [fromMinute, setFromMinute] = useState("00");
  const [fromPeriod, setFromPeriod] = useState("AM");

  const [toHour, setToHour] = useState("12");
  const [toMinute, setToMinute] = useState("00");
  const [toPeriod, setToPeriod] = useState("AM");

  const currDate = new Date();

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1));

  const minutes = useMemo(
    () => Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0")),
    [],
  );

  const disabled =
    !foundLocation.current || !from || !to || !fromHour || !toHour;

  async function fetchLocations() {
    setLoading(true);

    try {
      const data = await axios.get(api.OpenStreetMap + `&q=${search}`);

      setLocations(data.data);
    } finally {
      setLoading(false);
    }
  }

  async function fetchStoreLocations() {
    try {
      const data = await apiRequest.get(api.Locations);

      setDropLocations(data);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
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

  useEffect(() => {
    if (differentDropLocation && coords.current.lat && coords.current.long) {
      fetchStoreLocations();
    }
  }, [differentDropLocation, search]);

  const selectForDifferentDropLocation = useMemo(
    () => (
      <div className="mt-4">
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Drop Location
        </label>

        <div className="relative">
          <select
            value={selectedDropLocation}
            onChange={(e) => {
              const value = e.target.value;

              setSelectedDropLocation(value);

              const selected = dropLocations.find(
                (location) => location.id === value,
              );

              if (selected) {
                dropCoords.current = {
                  lat: selected.lat,
                  long: selected.long,
                };
              }
            }}
            className="
        h-14
        w-full
        appearance-none
        rounded-xl
        border
        border-slate-300
        bg-white
        px-4
        pr-10
        text-sm
        font-medium
        text-slate-800
        shadow-sm
        transition-all
        duration-200
        outline-none
        hover:border-slate-400
        focus:border-blue-500
        focus:ring-4
        focus:ring-blue-100
      "
          >
            <option value="">Choose a drop location</option>

            {dropLocations.slice(0, 200).map((location) => (
              <option key={location.id} value={location.id}>
                {location.name} • {location.city}, {location.state}
              </option>
            ))}
          </select>

          <svg
            className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    ),
    [search, differentDropLocation, dropLocations, selectedDropLocation],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-100 p-8">
      <Card className="mx-auto max-w-5xl rounded-3xl border-0 bg-white/90 p-10 shadow-2xl backdrop-blur">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900">
            Find Your Perfect Ride
          </h1>

          <p className="mt-3 text-slate-500">
            Search vehicles available near you.
          </p>
        </div>

        {/* Part 2 starts here */}
        {/* Pickup Location Search */}
        <div className="relative">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Pickup Location
          </label>

          <Input
            placeholder="Search city or pickup location..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              foundLocation.current = false;

              if (differentDropLocation) {
                setSelectedDropLocation("");
                dropCoords.current = {
                  lat: null,
                  long: null,
                };
              }
            }}
            className="h-14 rounded-xl border-slate-300 px-4 text-base transition-all focus:border-blue-500"
          />

          {open && (
            <div className="absolute z-50 mt-2 w-full rounded-xl border bg-background shadow-xl">
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
                          <MapPin className="mr-2 h-4 w-4 text-blue-600" />

                          <span className="truncate">
                            {location.display_name}
                          </span>
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

        {/* Different Drop Location */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">
                Different Drop Location
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Return the vehicle at another rental location.
              </p>
            </div>

            <Switch
              checked={differentDropLocation}
              onCheckedChange={(value) => {
                if (value && !foundLocation.current) {
                  toast.error("Please select a pickup location first.");
                  return;
                }

                if (!value) {
                  setSelectedDropLocation("");

                  dropCoords.current = {
                    lat: null,
                    long: null,
                  };
                }

                setDifferentDropLocation(value);
              }}
            />
          </div>
          {search &&
            differentDropLocation &&
            dropLocations &&
            dropLocations.length > 0 &&
            selectForDifferentDropLocation}
        </div>

        {/* Date & Time Section Starts Here */}
        <div className="mt-8 flex gap-6"></div>
        <div className="mt-8 flex gap-6">
          {/* From */}
          <div className="flex-1">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Pickup Date & Time
            </label>

            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-12 flex-1 justify-between rounded-xl border-slate-300"
                  >
                    {from ? from.toLocaleDateString() : "Select date"}

                    <CalendarIcon className="h-4 w-4 text-slate-500" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto rounded-xl p-0 shadow-xl">
                  <Calendar
                    mode="single"
                    selected={from}
                    onSelect={(date) => {
                      if ((to && date >= to) || currDate > date) {
                        toast.error("Please select a valid date range.", {
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

              <Select value={fromHour} onValueChange={setFromHour}>
                <SelectTrigger className="h-12 w-24 rounded-xl">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {hours.map((hour) => (
                    <SelectItem key={hour} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={fromMinute} onValueChange={setFromMinute}>
                <SelectTrigger className="h-12 w-24 rounded-xl">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {minutes.map((minute) => (
                    <SelectItem key={minute} value={minute}>
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={fromPeriod} onValueChange={setFromPeriod}>
                <SelectTrigger className="h-12 w-24 rounded-xl">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* To */}
          <div className="flex-1">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Return Date & Time
            </label>

            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-12 flex-1 justify-between rounded-xl border-slate-300"
                  >
                    {to ? to.toLocaleDateString() : "Select date"}

                    <CalendarIcon className="h-4 w-4 text-slate-500" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto rounded-xl p-0 shadow-xl">
                  <Calendar
                    mode="single"
                    selected={to}
                    onSelect={(date) => {
                      if ((from && date <= from) || currDate > date) {
                        toast.error("Please select a valid date range.", {
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

              <Select value={toHour} onValueChange={setToHour}>
                <SelectTrigger className="h-12 w-24 rounded-xl">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {hours.map((hour) => (
                    <SelectItem key={hour} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={toMinute} onValueChange={setToMinute}>
                <SelectTrigger className="h-12 w-24 rounded-xl">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {minutes.map((minute) => (
                    <SelectItem key={minute} value={minute}>
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={toPeriod} onValueChange={setToPeriod}>
                <SelectTrigger className="h-12 w-24 rounded-xl">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Search Button starts next */}
        <div className="mt-10 flex justify-center">
          <Button
            size="lg"
            disabled={disabled}
            onClick={() => {
              const fromTime = formatTime(fromHour, fromMinute, fromPeriod);

              const toTime = formatTime(toHour, toMinute, toPeriod);

              const params = new URLSearchParams({
                start_date: formatDate(from),
                to_date: formatDate(to),
                from_time: fromTime,
                to_time: toTime,
                ...(selectedDropLocation && {
                  drop_location_id: selectedDropLocation,
                }),
              });

              nav(
                Routes.SearchResult +
                  "?" +
                  `lat=${coords.current.lat}` +
                  `&long=${coords.current.long}` +
                  `&name=${encodeURIComponent(search)}` +
                  `&${params.toString()}`,
              );
            }}
            className="
              h-14
              rounded-xl
              bg-gradient-to-r
              from-blue-600
              to-indigo-600
              px-12
              text-base
              font-semibold
              shadow-lg
              transition-all
              duration-300
              hover:scale-[1.02]
              hover:from-blue-700
              hover:to-indigo-700
              active:scale-[0.98]
            "
          >
            <Search className="mr-2 h-5 w-5" />
            Search Vehicles
          </Button>
        </div>
      </Card>
    </div>
  );
}
