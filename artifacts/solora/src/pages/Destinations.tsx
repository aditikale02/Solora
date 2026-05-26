import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal } from "lucide-react";
import { fetchDestinationCategories, fetchPublicDestinations } from "@workspace/api-client-react";
import { setPageSeo } from "@/lib/seo";

const fallbackImage = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80";

export default function DestinationsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [season, setSeason] = useState("");

  const destinationsQuery = useQuery({ queryKey: ["public", "destinations"], queryFn: fetchPublicDestinations });
  const categoriesQuery = useQuery({ queryKey: ["public", "categories"], queryFn: fetchDestinationCategories });

  useEffect(() => {
    setPageSeo("Destinations | Solora", "Browse India destinations by category, mood, and travel style.");
  }, []);

  const destinations = useMemo(() => {
    const selectedCategoryId = categoriesQuery.data?.find((entry) => entry.slug === category)?.id;

    return (destinationsQuery.data ?? []).filter((destination) => {
      const haystack = `${destination.title} ${destination.state} ${destination.city} ${destination.shortDescription}`.toLowerCase();
      const matchesSearch = !search || haystack.includes(search.toLowerCase());
      const matchesCategory = !selectedCategoryId || destination.categoryId === selectedCategoryId;
      const matchesState = !stateFilter || destination.state.toLowerCase().includes(stateFilter.toLowerCase());
      const matchesSeason = !season || destination.bestSeason.toLowerCase().includes(season.toLowerCase());
      return matchesSearch && matchesState && matchesSeason && matchesCategory;
    });
  }, [category, categoriesQuery.data, destinationsQuery.data, search, season, stateFilter]);

  return (
    <main className="min-h-screen bg-[#F7F2EC] px-4 py-10 text-[#1A1714] md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#8B6340]">Destination Explorer</p>
            <h1 className="mt-2 font-serif text-5xl">Browse India by mood and memory</h1>
          </div>
          <Link href="/dashboard" className="text-sm text-[#8B6340] underline-offset-4 hover:underline">Traveler dashboard</Link>
        </div>

        <section className="mb-8 rounded-[28px] border border-[#E3D6C1] bg-white/85 p-5 shadow-sm backdrop-blur-xl">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#8B6340]" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search destinations, cities, or states" className="h-12 w-full rounded-2xl border border-[#E3D6C1] bg-white pl-11 pr-4 text-sm outline-none" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-[#E3D6C1] bg-[#FBF7F1] px-4 text-sm text-[#5A4C3A]">
              <SlidersHorizontal className="size-4" />
              Filters
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-11 rounded-2xl border border-[#E3D6C1] bg-white px-4 text-sm outline-none">
              <option value="">All categories</option>
              {(categoriesQuery.data ?? []).map((entry) => (
                <option key={entry.id} value={entry.slug}>{entry.title}</option>
              ))}
            </select>
            <input value={stateFilter} onChange={(event) => setStateFilter(event.target.value)} placeholder="State" className="h-11 rounded-2xl border border-[#E3D6C1] bg-white px-4 text-sm outline-none" />
            <input value={season} onChange={(event) => setSeason(event.target.value)} placeholder="Best season" className="h-11 rounded-2xl border border-[#E3D6C1] bg-white px-4 text-sm outline-none" />
            <div className="h-11 rounded-2xl border border-dashed border-[#D7C6A5] px-4 py-2 text-sm text-[#8B6340]">Category selector is powered by the destination categories table.</div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {destinations.map((destination) => (
            <Link key={destination.id} href={`/destinations/${destination.slug}`} className="group overflow-hidden rounded-[24px] border border-[#E3D6C1] bg-white/85 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <img src={destination.heroImageUrl || fallbackImage} alt={destination.title} className="h-56 w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
              <div className="p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-[#8B6340]">{destination.state} · {destination.city}</p>
                <h2 className="mt-2 font-serif text-3xl">{destination.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-[#5A4C3A]">{destination.shortDescription}</p>
                <div className="mt-4 flex items-center justify-between text-sm text-[#6A5A47]">
                  <span>{destination.bestSeason || "All seasons"}</span>
                  <span>{destination.estimatedBudget || "Custom budget"}</span>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
