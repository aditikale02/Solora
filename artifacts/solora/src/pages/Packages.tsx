import { Link } from "wouter";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import { fetchPublicPackages } from "@workspace/api-client-react";
import { setPageSeo } from "@/lib/seo";

const fallbackImage = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80";

function PackageCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-[#E3D6C1] bg-white/70">
      <div className="h-44 animate-pulse bg-[#EFE4D4]" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-2/3 animate-pulse rounded bg-[#EFE4D4]" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-[#EFE4D4]" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-[#EFE4D4]" />
      </div>
    </div>
  );
}

export default function PackagesPage() {
  const packagesQuery = useQuery({
    queryKey: ["public", "packages"],
    queryFn: fetchPublicPackages,
  });

  useEffect(() => {
    setPageSeo(
      "Solo Travel Packages | Solora",
      "Explore solo travel packages with destination details, pricing, and curated journeys.",
    );
  }, []);

  return (
    <main className="min-h-screen bg-[#F7F2EC] px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#8B6340]">Public Packages</p>
            <h1 className="mt-2 font-serif text-4xl text-[#1A1714]">Find Your Solo Journey</h1>
          </div>
          <Link href="/" className="text-sm text-[#8B6340] underline-offset-4 hover:underline">Back Home</Link>
        </header>

        {packagesQuery.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PackageCardSkeleton key={i} />
            ))}
          </div>
        ) : null}

        {packagesQuery.isError ? (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            Could not load packages right now. Please try again.
          </div>
        ) : null}

        {packagesQuery.data && packagesQuery.data.length === 0 ? (
          <div className="rounded-lg border border-[#E3D6C1] bg-white/80 p-8 text-center text-sm text-[#5A4C3A]">
            No packages found at the moment. Please check back shortly.
          </div>
        ) : null}

        {packagesQuery.data && packagesQuery.data.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {packagesQuery.data.map((travelPackage) => (
              <article key={travelPackage.id} className="overflow-hidden rounded-xl border border-[#E3D6C1] bg-white/80 shadow-sm">
                <img
                  src={travelPackage.heroImageUrl || fallbackImage}
                  alt={travelPackage.title}
                  className="h-44 w-full object-cover"
                  loading="lazy"
                  onError={(event) => {
                    (event.currentTarget as HTMLImageElement).src = fallbackImage;
                  }}
                />
                <div className="p-4">
                  <h2 className="font-serif text-2xl text-[#1A1714]">{travelPackage.title}</h2>
                  <p className="mt-1 flex items-center gap-1 text-sm text-[#6A5A47]">
                    <MapPin className="size-4" />
                    {travelPackage.destinationName ?? "Destination"}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-[#4A3E31]">{travelPackage.description}</p>
                  <p className="mt-3 text-sm font-medium text-[#1A1714]">
                    {travelPackage.priceCurrency} {travelPackage.priceAmount.toLocaleString()} · {travelPackage.durationDays} days
                  </p>
                  <Link
                    href={`/packages/${travelPackage.slug}`}
                    className="mt-4 inline-flex rounded-md bg-[#1A1714] px-3 py-2 text-sm text-[#F7F0E6]"
                  >
                    View details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
