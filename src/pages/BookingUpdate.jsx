import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { api } from "@/api/api";
import { apiRequest } from "@/api/interceptor";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  CalendarDays,
  Car,
  Clock,
  IndianRupee,
  Loader2,
  MapPin,
  Save,
  User,
  ArrowRight,
  Check,
  AlertCircle,
} from "lucide-react";

import { toast } from "sonner";
import { formatDate } from "@/utils/dateFormater";
import { Routes } from "@/routes/routes";

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));

const MINUTES = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0"),
);

const HOUR_MAP = {
  1: { AM: "01", PM: "13" },
  2: { AM: "02", PM: "14" },
  3: { AM: "03", PM: "15" },
  4: { AM: "04", PM: "16" },
  5: { AM: "05", PM: "17" },
  6: { AM: "06", PM: "18" },
  7: { AM: "07", PM: "19" },
  8: { AM: "08", PM: "20" },
  9: { AM: "09", PM: "21" },
  10: { AM: "10", PM: "22" },
  11: { AM: "11", PM: "23" },
  12: { AM: "00", PM: "12" },
};

function formatTime(hour, minute, period) {
  return HOUR_MAP[hour][period] + ":" + minute;
}

function parseTime(time) {
  const [h, m] = time.split(":");

  let hour = Number(h);

  const period = hour >= 12 ? "PM" : "AM";

  hour = hour % 12 || 12;

  return {
    hour: String(hour),
    minute: m,
    period,
  };
}

const BookingUpdate = () => {
  const { id } = useParams();
  const nav = useNavigate();

  const [booking, setBooking] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    start_date: "",
    to_date: "",

    start_hour: "12",
    start_minute: "00",
    start_period: "AM",

    end_hour: "12",
    end_minute: "00",
    end_period: "AM",

    status: "",
  });

  const fetchBooking = useCallback(async () => {
    try {
      setLoading(true);

      const data = await apiRequest.get(`${api.Bookings}/${id}`);

      const start = parseTime(data.start_time);

      const end = parseTime(data.end_time);

      setBooking(data);

      setForm({
        start_date: data.start_date,
        to_date: data.to_date,

        start_hour: start.hour,
        start_minute: start.minute,
        start_period: start.period,

        end_hour: end.hour,
        end_minute: end.minute,
        end_period: end.period,

        status: data.status,
      });
    } catch (err) {
      toast.error("Failed to load booking");
    } finally {
      setLoading(false);
    }
  }, [id]);

  async function updateBooking() {
    try {
      setSaving(true);
      const payload = {
        start_date: formatDate(form.start_date),
        end_date: formatDate(form.to_date),
        start_time: formatTime(
          form.start_hour,
          form.start_minute,
          form.start_period,
        ),
        end_time: formatTime(form.end_hour, form.end_minute, form.end_period),
      };
      await apiRequest.patch(api.Bookings + "/" + id, payload);
      toast.success("Updated successfully.");
      nav(Routes.Bookings);
    } catch (error) {
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-4" />
          <p className="text-white text-lg">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-900">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-white text-lg">Booking not found</p>
        </div>
      </div>
    );
  }

  // Only in-progress bookings can be edited
  const isEditable = booking?.status === "inprogress";
  
  // Safely access nested properties with fallbacks
  const vehicleData = booking?.vehicle || {};
  const userData = booking?.user || {};
  const pickupLocationData = booking?.pickupLocation || {};
  const dropLocationData = booking?.dropLocation || {};
  
  const customerName = booking?.guest_name || userData?.name || "N/A";
  const customerEmail = booking?.guest_email || userData?.email || "N/A";
  
  // Calculate rental duration
  const startDate = new Date(booking?.start_date);
  const endDate = new Date(booking?.to_date);
  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) || 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      {/* Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 px-6 py-12 text-white shadow-2xl">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 h-96 w-96 bg-indigo-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-96 w-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <Badge className="border-indigo-300/30 bg-indigo-500/20 text-indigo-100 hover:bg-indigo-500/30">
              ✓ Booking Management
            </Badge>

            <h1 className="mt-4 pb-2 text-5xl font-black bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
              Booking
            </h1>

            <p className="mt-3 text-lg text-slate-300">
              Manage your rental reservation
            </p>

            {!isEditable && (
              <div className="mt-6 flex items-center gap-2 rounded-xl bg-amber-500/20 border border-amber-400/50 px-4 py-3 text-amber-100">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-medium">
                  Read Only • Status: <span className="capitalize font-semibold">{booking?.status}</span>
                </span>
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 lg:min-w-72">
            <p className="text-sm text-slate-300 font-semibold uppercase tracking-wider">
              Booking Reference
            </p>
            <p className="mt-3 font-mono text-sm text-indigo-200 break-all hover:text-indigo-100 transition-colors">
              {booking?.id}
            </p>
            {booking?.createdAt && (
              <p className="mt-4 text-xs text-slate-400">
                Created {new Date(booking.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-6 px-6 py-10">
        {/* Vehicle + Pricing Card */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-0 shadow-lg lg:col-span-2 hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 p-6">
                  <Car className="h-10 w-10 text-blue-600" />
                </div>

                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Your Vehicle
                  </p>

                  <h2 className="mt-2 text-3xl font-black text-slate-900">
                    {vehicleData?.brand} {vehicleData?.name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-600">
                    {vehicleData?.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                      {vehicleData?.description}
                    </Badge>
                    <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                      <IndianRupee className="h-3 w-3 mr-1" />
                      ₹{vehicleData?.price?.toLocaleString()} / day
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Summary */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Total Price
              </p>

              <div className="mt-4 flex items-baseline gap-1">
                <IndianRupee className="h-6 w-6 text-green-600 flex-shrink-0" />
                <span className="text-4xl font-black text-green-600">
                  {booking?.total_price?.toLocaleString()}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Rate:</span>
                  <span className="font-semibold">₹{vehicleData?.price?.toLocaleString()}/day</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Duration:</span>
                  <span className="font-semibold">{days} {days === 1 ? 'day' : 'days'}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between font-bold text-slate-900">
                  <span>Total:</span>
                  <span>₹{booking?.total_price?.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Location Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Pickup Location */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 p-3 flex-shrink-0">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>

                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Pickup Location
                  </p>

                  <h3 className="mt-2 text-xl font-bold text-slate-900">
                    {pickupLocationData?.name || "Not specified"}
                  </h3>

                  {pickupLocationData?.name && (
                    <div className="mt-4 space-y-2 text-sm">
                      <p className="text-slate-600">
                        <span className="font-semibold">{pickupLocationData?.city}</span>, {pickupLocationData?.state}
                      </p>
                      <p className="text-xs text-slate-500">
                        📍 {pickupLocationData?.lat}, {pickupLocationData?.long}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Drop Location */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-gradient-to-br from-orange-100 to-red-100 p-3 flex-shrink-0">
                  <MapPin className="h-6 w-6 text-orange-600" />
                </div>

                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Drop Location
                  </p>

                  <h3 className="mt-2 text-xl font-bold text-slate-900">
                    {dropLocationData?.name || "Not specified"}
                  </h3>

                  {dropLocationData?.name && (
                    <div className="mt-4 space-y-2 text-sm">
                      <p className="text-slate-600">
                        <span className="font-semibold">{dropLocationData?.city}</span>, {dropLocationData?.state}
                      </p>
                      <p className="text-xs text-slate-500">
                        📍 {dropLocationData?.lat}, {dropLocationData?.long}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Information */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 p-3">
                <User className="h-6 w-6 text-purple-600" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Customer Information
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {booking?.user?.guest ? "Guest Booking" : "Registered User"}
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label className="text-sm font-semibold text-slate-700">Full Name</Label>
                <Input
                  className="mt-2 bg-slate-50 border-slate-200"
                  value={customerName}
                  disabled
                  placeholder="N/A"
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-slate-700">Email Address</Label>
                <Input
                  className="mt-2 bg-slate-50 border-slate-200"
                  value={customerEmail}
                  type="email"
                  disabled
                  placeholder="N/A"
                />
              </div>

              {booking?.user && (
                <div>
                  <Label className="text-sm font-semibold text-slate-700">Account Status</Label>
                  <Input
                    className="mt-2 bg-slate-50 border-slate-200"
                    value={booking.user.guest ? "Guest Account" : "Registered Account"}
                    disabled
                  />
                </div>
              )}

              {booking?.createdAt && (
                <div>
                  <Label className="text-sm font-semibold text-slate-700">Booking Date</Label>
                  <Input
                    className="mt-2 bg-slate-50 border-slate-200"
                    value={new Date(booking.createdAt).toLocaleDateString()}
                    disabled
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Trip Schedule */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-8">
            <div className="mb-8 flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 p-3">
                <CalendarDays className="h-6 w-6 text-orange-600" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Trip Schedule
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Configure your pickup and return details
                </p>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Pickup Section */}
              <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-6">
                <h3 className="mb-6 text-lg font-bold text-slate-900 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-600"></div>
                  Pickup Details
                </h3>

                <div className="space-y-5">
                  <div>
                    <Label className="text-sm font-semibold text-slate-700">Pickup Date</Label>
                    <Input
                      className="mt-2 bg-white border-green-300"
                      type="date"
                      value={form.start_date}
                      disabled={!isEditable}
                      onChange={(e) => {
                        if (e.target.value >= form.to_date) {
                          toast.error("Pickup date must be before return date");
                          return;
                        }
                        setForm((prev) => ({
                          ...prev,
                          start_date: e.target.value,
                        }));
                      }}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-slate-700">Pickup Time</Label>
                    <div className="mt-2 grid grid-cols-3 gap-3">
                      <Select
                        disabled={!isEditable}
                        value={form.start_hour}
                        onValueChange={(value) =>
                          setForm((prev) => ({
                            ...prev,
                            start_hour: value,
                          }))
                        }
                      >
                        <SelectTrigger className="bg-white border-green-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {HOURS.map((hour) => (
                            <SelectItem key={hour} value={hour}>
                              {hour}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        disabled={!isEditable}
                        value={form.start_minute}
                        onValueChange={(value) =>
                          setForm((prev) => ({
                            ...prev,
                            start_minute: value,
                          }))
                        }
                      >
                        <SelectTrigger className="bg-white border-green-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MINUTES.map((minute) => (
                            <SelectItem key={minute} value={minute}>
                              {minute}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        disabled={!isEditable}
                        value={form.start_period}
                        onValueChange={(value) =>
                          setForm((prev) => ({
                            ...prev,
                            start_period: value,
                          }))
                        }
                      >
                        <SelectTrigger className="bg-white border-green-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AM">AM</SelectItem>
                          <SelectItem value="PM">PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3 rounded-xl bg-white border border-green-300 p-4 text-sm font-semibold text-slate-900">
                    <Clock className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>
                      {form.start_date} • {String(form.start_hour).padStart(2, "0")}:{form.start_minute} {form.start_period}
                    </span>
                  </div>
                </div>
              </div>

              {/* Return Section */}
              <div className="rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 p-6">
                <h3 className="mb-6 text-lg font-bold text-slate-900 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-600"></div>
                  Return Details
                </h3>

                <div className="space-y-5">
                  <div>
                    <Label className="text-sm font-semibold text-slate-700">Return Date</Label>
                    <Input
                      className="mt-2 bg-white border-red-300"
                      type="date"
                      value={form.to_date}
                      disabled={!isEditable}
                      onChange={(e) => {
                        if (e.target.value <= form.start_date) {
                          toast.error("Return date must be after pickup date");
                          return;
                        }
                        setForm((prev) => ({
                          ...prev,
                          to_date: e.target.value,
                        }));
                      }}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-slate-700">Return Time</Label>
                    <div className="mt-2 grid grid-cols-3 gap-3">
                      <Select
                        disabled={!isEditable}
                        value={form.end_hour}
                        onValueChange={(value) =>
                          setForm((prev) => ({
                            ...prev,
                            end_hour: value,
                          }))
                        }
                      >
                        <SelectTrigger className="bg-white border-red-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {HOURS.map((hour) => (
                            <SelectItem key={hour} value={hour}>
                              {hour}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        disabled={!isEditable}
                        value={form.end_minute}
                        onValueChange={(value) =>
                          setForm((prev) => ({
                            ...prev,
                            end_minute: value,
                          }))
                        }
                      >
                        <SelectTrigger className="bg-white border-red-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MINUTES.map((minute) => (
                            <SelectItem key={minute} value={minute}>
                              {minute}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        disabled={!isEditable}
                        value={form.end_period}
                        onValueChange={(value) =>
                          setForm((prev) => ({
                            ...prev,
                            end_period: value,
                          }))
                        }
                      >
                        <SelectTrigger className="bg-white border-red-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AM">AM</SelectItem>
                          <SelectItem value="PM">PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3 rounded-xl bg-white border border-red-300 p-4 text-sm font-semibold text-slate-900">
                    <Clock className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <span>
                      {form.to_date} • {String(form.end_hour).padStart(2, "0")}:{form.end_minute} {form.end_period}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status & Action Section */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-r from-slate-50 to-indigo-50">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {isEditable ? (
                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                  ) : (
                    <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                  )}
                  <span className="text-sm font-semibold uppercase tracking-wider text-slate-600">
                    Status: <span className="capitalize text-slate-900">{booking?.status}</span>
                  </span>
                </div>

                <div className="text-sm text-slate-600 space-y-1">
                  <p>Vehicle: <span className="font-semibold text-slate-900">{vehicleData?.brand} {vehicleData?.name}</span></p>
                  <p>Rental Duration: <span className="font-semibold text-slate-900">{days} {days === 1 ? 'day' : 'days'}</span></p>
                </div>

                {!isEditable && (
                  <div className="mt-4 p-4 rounded-lg bg-amber-50 border border-amber-200">
                    <p className="text-sm text-amber-900">
                      <span className="font-semibold">Note:</span> This booking cannot be edited because its status is <span className="capitalize font-semibold">{booking?.status}</span>
                    </p>
                  </div>
                )}
              </div>

              {isEditable && (
                <Button
                  disabled={saving}
                  onClick={updateBooking}
                  className="h-14 px-8 text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      Save Changes
                    </>
                  )}
                </Button>
              )}

              {!isEditable && (
                <Badge className="px-6 py-3 text-base font-semibold bg-amber-100 text-amber-800 border-amber-300">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Read-Only
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingUpdate;
