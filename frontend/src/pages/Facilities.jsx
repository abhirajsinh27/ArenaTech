
import { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  RefreshCw,
  IndianRupee,
  ArrowUpRight,
  Dumbbell,
  X,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const initialFilters = {
  search: "",
  city: "",
  sport_type: "",
  min_price: "",
  max_price: "",
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(Number(price));
}

export default function Facilities() {
  const [facilities, setFacilities] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchFacilities() {
      setIsLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();

        Object.entries(appliedFilters).forEach(([key, value]) => {
          if (value.trim()) {
            params.set(key, value.trim());
          }
        });

        const response = await fetch(
          `${API_URL}/api/facilities?${params.toString()}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Unable to load sports facilities.");
        }

        const data = await response.json();
        setFacilities(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(
            err.message ||
              "Unable to connect to ArenaTech. Please try again."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchFacilities();

    return () => controller.abort();
  }, [appliedFilters]);

  function updateFilter(event) {
    const { name, value } = event.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSearch(event) {
    event.preventDefault();
    setAppliedFilters({ ...filters });
  }

  function clearFilters() {
    setFilters(initialFilters);
    setAppliedFilters({ ...initialFilters });
  }

  const hasFilters = Object.values(filters).some(
    (value) => value.trim() !== ""
  );

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Page heading */}
        <section>
          <p className="text-sm font-medium text-emerald-700">
            ArenaTech Gujarat / Discover
          </p>

          <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Sports Facilities
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
                Discover grounds, courts and sports centres for your next game.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin size={17} className="text-emerald-700" />
              <span>Explore facilities across Gujarat</span>
            </div>
          </div>
        </section>

        {/* Search and filters */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center gap-2">
            <SlidersHorizontal size={19} className="text-emerald-700" />
            <h2 className="font-semibold text-slate-900">
              Find your facility
            </h2>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  Search
                </span>
                <div className="relative">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    name="search"
                    value={filters.search}
                    onChange={updateFilter}
                    placeholder="Facility name or location"
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  City
                </span>
                <input
                  name="city"
                  value={filters.city}
                  onChange={updateFilter}
                  placeholder="e.g. Ahmedabad"
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  Sport
                </span>
                <select
                  name="sport_type"
                  value={filters.sport_type}
                  onChange={updateFilter}
                  className={inputClass}
                >
                  <option value="">All sports</option>
                  <option value="Cricket">Cricket</option>
                  <option value="Football">Football</option>
                  <option value="Badminton">Badminton</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Swimming">Swimming</option>
                  <option value="Gym">Gym</option>
                  <option value="Volleyball">Volleyball</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  Minimum hourly price (₹)
                </span>
                <input
                  type="number"
                  name="min_price"
                  min="0"
                  step="0.01"
                  value={filters.min_price}
                  onChange={updateFilter}
                  placeholder="No minimum"
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  Maximum hourly price (₹)
                </span>
                <input
                  type="number"
                  name="max_price"
                  min="0"
                  step="0.01"
                  value={filters.max_price}
                  onChange={updateFilter}
                  placeholder="No maximum"
                  className={inputClass}
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
              >
                <Search size={17} />
                Search facilities
              </button>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <X size={16} />
                  Clear filters
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Results heading */}
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Available facilities
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {isLoading
                  ? "Finding facilities..."
                  : `${facilities.length} ${
                      facilities.length === 1 ? "facility" : "facilities"
                    } found on this page`}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setAppliedFilters({ ...filters })}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                  <div className="h-44 bg-slate-200" />
                  <div className="space-y-3 p-5">
                    <div className="h-4 w-2/3 rounded bg-slate-200" />
                    <div className="h-3 w-1/2 rounded bg-slate-200" />
                    <div className="h-8 w-1/3 rounded bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {!isLoading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <h3 className="font-semibold text-red-900">
                Could not load facilities
              </h3>
              <p className="mt-2 text-sm text-red-800">{error}</p>
              <button
                type="button"
                onClick={() => setAppliedFilters({ ...filters })}
                className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && facilities.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
                <Dumbbell size={26} />
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                No facilities found yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                Try changing your filters. Approved sports facilities will
                appear here when they are available on ArenaTech.
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 rounded-xl bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* Facility cards */}
          {!isLoading && !error && facilities.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {facilities.map((facility) => (
                <article
                  key={facility.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative flex h-48 items-center justify-center overflow-hidden bg-linear-to-br from-emerald-100 via-emerald-50 to-slate-100">
                    {facility.image_url ? (
                      <img
                        src={facility.image_url}
                        alt={facility.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <Dumbbell
                        size={42}
                        strokeWidth={1.4}
                        className="text-emerald-800/60"
                      />
                    )}

                    <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-emerald-800 shadow-sm">
                      {facility.sport_type}
                    </span>
                  </div>

                  <div className="space-y-4 p-5">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {facility.name}
                      </h3>

                      <p className="mt-2 flex items-start gap-2 text-sm text-slate-600">
                        <MapPin
                          size={16}
                          className="mt-0.5 shrink-0 text-emerald-700"
                        />
                        <span>
                          {facility.address}, {facility.city},{" "}
                          {facility.state}
                        </span>
                      </p>
                    </div>

                    {facility.description && (
                      <p className="line-clamp-2 text-sm leading-6 text-slate-600">
                        {facility.description}
                      </p>
                    )}

                    {facility.amenities?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {facility.amenities.slice(0, 3).map((amenity) => (
                          <span
                            key={amenity}
                            className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
                          >
                            {amenity}
                          </span>
                        ))}
                        {facility.amenities.length > 3 && (
                          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                            +{facility.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                      <div>
                        <p className="text-xs text-slate-500">
                          Starting price
                        </p>
                        <p className="mt-1 flex items-center text-xl font-bold text-emerald-800">
                          <IndianRupee size={17} />
                          {formatPrice(facility.price_per_hour)}
                          <span className="ml-1 text-xs font-normal text-slate-500">
                            / hour
                          </span>
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled
                        title="Facility details and booking will be enabled in the next implementation step."
                        className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2.5 text-sm font-semibold text-slate-500"
                      >
                        Details
                        <ArrowUpRight size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
