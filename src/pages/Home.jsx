import { ArrowRight, CarFront } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100vh-70px)] items-center justify-center bg-gradient-to-br from-sky-50 via-white to-indigo-100 px-6">
      <Card className="w-full max-w-3xl border-0 bg-white/80 p-12 shadow-2xl backdrop-blur">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
            <CarFront className="h-10 w-10 text-white" />
          </div>

          <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
            Trusted Vehicle Rental
          </span>

          <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-slate-900">
            Start Your
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {" "}
              Rental Journey
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Discover cars at the best prices. Search, book, and
            travel with confidence—your next adventure starts here.
          </p>

          <Button
            size="lg"
            className="mt-10 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 text-base shadow-lg transition-all hover:scale-105 hover:from-blue-700 hover:to-indigo-700"
            onClick={() => navigate("/search")}
          >
            Start Renting
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </Card>
    </div>
  );
}