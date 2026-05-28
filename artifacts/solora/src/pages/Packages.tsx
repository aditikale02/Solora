import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, Check, Filter, MapPin, Sparkles } from "lucide-react";
import {
  fetchPublicPackages,
  fetchSavedPackages,
  savePackage,
  unsavePackage,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoginPromptDialog } from "@/components/auth/LoginPromptDialog";
import { useLeadInquiry } from "@/components/lead/LeadInquiryProvider";
import { useSessionRole } from "@/hooks/use-session-role";
import { setPageSeo } from "@/lib/seo";
import { toast } from "sonner";

const fallbackImage = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80";

function splitList(value: string): string[] {
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function PackageCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[#E3D6C1] bg-white/80">
      <div className="h-52 animate-pulse bg-[#EFE4D4]" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-[#EFE4D4]" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-[#EFE4D4]" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-[#EFE4D4]" />
      </div>
    </div>
  );
}

export default function PackagesPage() {
  const queryClient = useQueryClient();
  const session = useSessionRole();
  const { openInquiry } = useLeadInquiry();
  const [search, setSearch] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("");
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const [loginPromptTitle, setLoginPromptTitle] = useState("Please login to continue");
  const [loginPromptDescription, setLoginPromptDescription] = useState(
    "This action is available after login so your saved trips and inquiries stay in sync.",
  );

  const packagesQuery = useQuery({
    queryKey: ["public", "packages"],
    queryFn: fetchPublicPackages,
  });

  const savedPackagesQuery = useQuery({
    queryKey: ["user", "saved-packages"],
    queryFn: fetchSavedPackages,
    enabled: session.status === "user",
  });

  const saveMutation = useMutation({
    mutationFn: savePackage,
    onSuccess: async () => {
      toast.success("Package saved.");
      await queryClient.invalidateQueries({ queryKey: ["user", "saved-packages"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not save package."),
  });

  const unsaveMutation = useMutation({
    mutationFn: unsavePackage,
    onSuccess: async () => {
      toast.success("Package removed from saved trips.");
      await queryClient.invalidateQueries({ queryKey: ["user", "saved-packages"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not update saved packages."),
  });

  useEffect(() => {
    setPageSeo(
      "Packages | Solora",
      "Browse curated India travel packages with pricing, destinations, and public detail pages.",
    );
  }, []);

  const destinations = useMemo(() => {
    return Array.from(new Set((packagesQuery.data ?? []).map((travelPackage) => travelPackage.destinationName ?? "Destination")));
  }, [packagesQuery.data]);

  const savedPackageIds = useMemo(() => {
    return new Set((savedPackagesQuery.data ?? []).map((entry) => entry.package.id));
  }, [savedPackagesQuery.data]);

  const filteredPackages = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return (packagesQuery.data ?? []).filter((travelPackage) => {
      const haystack = [
        travelPackage.title,
        travelPackage.destinationName ?? "",
        travelPackage.description,
        travelPackage.features,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !normalizedSearch || haystack.includes(normalizedSearch);
      const matchesDestination = !destinationFilter || (travelPackage.destinationName ?? "") === destinationFilter;

      return matchesSearch && matchesDestination;
    });
  }, [destinationFilter, packagesQuery.data, search]);

  function promptLogin(title: string, description: string) {
    setLoginPromptTitle(title);
    setLoginPromptDescription(description);
    setLoginPromptOpen(true);
  }

  async function handleSavePackage(packageId: string) {
    if (session.status !== "user") {
      promptLogin("Please login to save packages", "Saving a package is tied to your profile so you can revisit it later.");
      return;
    }

    if (savedPackageIds.has(packageId)) {
      await unsaveMutation.mutateAsync(packageId);
      return;
    }

    await saveMutation.mutateAsync(packageId);
  }

  function handleBookNow(packageTitle: string) {
    if (session.status !== "user" && session.status !== "admin") {
      promptLogin("Please login to continue", `Book ${packageTitle} after logging in so we can keep your inquiry connected to your profile.`);
      return;
    }

    openInquiry({ mode: "lead", source: "website" });
  }

  return (
    <main className="min-h-screen bg-[#F7F2EC] px-4 py-10 text-[#1A1714] md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-[30px] border border-[#E3D6C1] bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(247,242,236,0.8))] p-6 shadow-sm backdrop-blur-xl md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.32em] text-[#8B6340]">Public Packages</p>
              <h1 className="mt-3 font-serif text-5xl">Find Your Solo Journey</h1>
              <p className="mt-4 text-sm leading-7 text-[#5A4C3A]">
                Browse curated India packages, filter by destination, and open the detail pages without logging in.
              </p>
            </div>
            <Link href="/" className="text-sm text-[#8B6340] underline-offset-4 hover:underline">
              Back Home
            </Link>
          </div>

          <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_260px]">
            <div className="relative">
              <Sparkles className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#8B6340]" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search packages, destinations, or included features"
                className="h-12 border-[#E3D6C1] bg-white pl-11 text-[#1A1714] caret-[#1A1714]"
              />
            </div>
            <select
              value={destinationFilter}
              onChange={(event) => setDestinationFilter(event.target.value)}
              className="h-12 rounded-2xl border border-[#E3D6C1] bg-white px-4 text-sm text-[#1A1714] outline-none"
            >
              <option value="">All destinations</option>
              {destinations.map((destination) => (
                <option key={destination} value={destination}>
                  {destination}
                </option>
              ))}
            </select>
          </div>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {packagesQuery.isLoading ? (
            Array.from({ length: 6 }).map((_, index) => <PackageCardSkeleton key={index} />)
          ) : null}

          {packagesQuery.isError ? (
            <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
              Could not load packages right now. Please try again.
            </div>
          ) : null}

          {!packagesQuery.isLoading && filteredPackages.length === 0 ? (
            <div className="rounded-2xl border border-[#E3D6C1] bg-white/80 p-8 text-sm text-[#5A4C3A]">
              No packages match your search yet.
            </div>
          ) : null}

          {filteredPackages.map((travelPackage) => {
            const isSaved = savedPackageIds.has(travelPackage.id);
            const tags = splitList(travelPackage.features).slice(0, 3);

            return (
              <article key={travelPackage.id} className="group overflow-hidden rounded-[26px] border border-[#E3D6C1] bg-white/88 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="relative">
                  <img
                    src={travelPackage.heroImageUrl || fallbackImage}
                    alt={travelPackage.title}
                    className="h-56 w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                    loading="lazy"
                    onError={(event) => {
                      (event.currentTarget as HTMLImageElement).src = fallbackImage;
                    }}
                  />
                  <div className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white backdrop-blur-md">
                    {travelPackage.destinationName ?? "Destination"}
                  </div>
                  <div className="absolute right-4 top-4 rounded-full bg-[#F7F0E6]/90 px-3 py-1 text-xs font-medium text-[#1A1714] backdrop-blur-md">
                    ★ 4.8
                  </div>
                </div>

                <div className="grid gap-4 p-5">
                  <div>
                    <h2 className="font-serif text-3xl text-[#1A1714]">{travelPackage.title}</h2>
                    <p className="mt-1 flex items-center gap-1 text-sm text-[#6A5A47]">
                      <MapPin className="size-4" />
                      {travelPackage.destinationName ?? "Destination"} · {travelPackage.durationDays} days
                    </p>
                  </div>

                  <p className="line-clamp-2 text-sm leading-7 text-[#4A3E31]">{travelPackage.description}</p>

                  {tags.length ? (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span key={tag} className="rounded-full border border-[#E3D6C1] bg-[#FBF7F1] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#8B6340]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="flex items-center justify-between gap-4 border-t border-[#E3D6C1] pt-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-[#8B6340]">Starting from</p>
                      <p className="mt-1 text-lg font-semibold text-[#1A1714]">
                        {travelPackage.priceCurrency} {travelPackage.priceAmount.toLocaleString()}
                      </p>
                    </div>
                    <Link href={`/packages/${travelPackage.slug}`} className="rounded-full border border-[#D7C6A5] bg-white px-4 py-2 text-sm text-[#1A1714] transition hover:border-[#8B6340] hover:text-[#8B6340]">
                      View Details
                    </Link>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleSavePackage(travelPackage.id)}
                      disabled={saveMutation.isPending || unsaveMutation.isPending}
                      className="border-[#D7C6A5] bg-white text-[#1A1714]"
                    >
                      {isSaved ? <Check className="mr-2 size-4" /> : <Bookmark className="mr-2 size-4" />}
                      {isSaved ? "Saved" : "Save"}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleBookNow(travelPackage.title)}
                      className="bg-[#1A1714] text-[#F7F0E6] hover:bg-[#2B2520]"
                    >
                      Book Now
                    </Button>
                    <Link
                      href={`/packages/${travelPackage.slug}`}
                      className="inline-flex items-center justify-center rounded-md border border-[#D7C6A5] bg-[#FBF7F1] px-3 py-2 text-sm text-[#1A1714]"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>

      <LoginPromptDialog
        open={loginPromptOpen}
        onOpenChange={setLoginPromptOpen}
        title={loginPromptTitle}
        description={loginPromptDescription}
      />
    </main>
  );
}
