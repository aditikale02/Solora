import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, Check, MapPin } from "lucide-react";
import {
  fetchPublicPackageBySlug,
  fetchSavedPackages,
  savePackage,
  unsavePackage,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { LoginPromptDialog } from "@/components/auth/LoginPromptDialog";
import { useLeadInquiry } from "@/components/lead/LeadInquiryProvider";
import { useSessionRole } from "@/hooks/use-session-role";
import { setPageSeo } from "@/lib/seo";
import { toast } from "sonner";

const fallbackImage = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80";

export default function PackageDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();
  const { openInquiry } = useLeadInquiry();
  const session = useSessionRole();
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const [loginPromptTitle, setLoginPromptTitle] = useState("Please login to continue");
  const [loginPromptDescription, setLoginPromptDescription] = useState(
    "This action is available after login so we can keep your saved items and inquiries connected to your account.",
  );

  const packageQuery = useQuery({
    queryKey: ["public", "package", slug],
    queryFn: () => fetchPublicPackageBySlug(String(slug)),
    enabled: Boolean(slug),
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
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not update saved package."),
  });

  useEffect(() => {
    if (!packageQuery.data) {
      return;
    }

    setPageSeo(
      `${packageQuery.data.package.title} | Solora`,
      packageQuery.data.package.description.slice(0, 150),
    );
  }, [packageQuery.data]);

  const savedPackageIds = useMemo(() => {
    return new Set((savedPackagesQuery.data ?? []).map((entry) => entry.package.id));
  }, [savedPackagesQuery.data]);

  function promptLogin(title: string, description: string) {
    setLoginPromptTitle(title);
    setLoginPromptDescription(description);
    setLoginPromptOpen(true);
  }

  async function handleSave() {
    if (!packageQuery.data) return;

    if (session.status !== "user") {
      promptLogin("Please login to save packages", "Saving a package keeps it attached to your account for later browsing.");
      return;
    }

    if (savedPackageIds.has(packageQuery.data.package.id)) {
      await unsaveMutation.mutateAsync(packageQuery.data.package.id);
      return;
    }

    await saveMutation.mutateAsync(packageQuery.data.package.id);
  }

  function handleInquiry(mode: "lead" | "contact") {
    if (session.status !== "user" && session.status !== "admin") {
      promptLogin("Please login to continue", "Inquiry shortcuts are available after login so your request stays tied to your profile.");
      return;
    }

    if (mode === "lead") {
      openInquiry({ mode: "lead", source: "website" });
      return;
    }

    openInquiry({ mode: "contact", source: "website", subject: `Question about ${packageQuery.data?.package.title ?? "this package"}` });
  }

  if (packageQuery.isLoading) {
    return (
      <main className="min-h-screen bg-[#F7F2EC] px-4 py-10 md:px-8">
        <div className="mx-auto max-w-5xl animate-pulse space-y-4">
          <div className="h-64 rounded-xl bg-[#EFE4D4]" />
          <div className="h-8 w-2/3 rounded bg-[#EFE4D4]" />
          <div className="h-4 w-1/2 rounded bg-[#EFE4D4]" />
          <div className="h-28 rounded bg-[#EFE4D4]" />
        </div>
      </main>
    );
  }

  if (packageQuery.isError || !packageQuery.data) {
    return (
      <main className="min-h-screen bg-[#F7F2EC] px-4 py-10 md:px-8">
        <div className="mx-auto max-w-5xl rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          Package not found or unavailable.
        </div>
      </main>
    );
  }

  const { package: travelPackage, images } = packageQuery.data;
  const gallery = images.length > 0 ? images : [{ id: "fallback", publicUrl: travelPackage.heroImageUrl || fallbackImage, altText: travelPackage.title, sortOrder: 0, packageId: travelPackage.id, isHero: true, createdAt: new Date() }];
  const tags = travelPackage.features
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-[#F7F2EC] px-4 py-10 md:px-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/packages" className="text-sm text-[#8B6340] underline-offset-4 hover:underline">Back to packages</Link>

        <section className="mt-4 overflow-hidden rounded-xl border border-[#E3D6C1] bg-white/80">
          <img
            src={travelPackage.heroImageUrl || fallbackImage}
            alt={travelPackage.title}
            className="h-[320px] w-full object-cover"
            onError={(event) => {
              (event.currentTarget as HTMLImageElement).src = fallbackImage;
            }}
          />
          <div className="p-6">
            <h1 className="font-serif text-4xl text-[#1A1714]">{travelPackage.title}</h1>
            <p className="mt-2 flex items-center gap-1 text-sm text-[#6A5A47]">
              <MapPin className="size-4" />
              {travelPackage.destinationName ?? "Destination"} · {travelPackage.durationDays} days
            </p>
            <p className="mt-2 text-sm font-medium text-[#1A1714]">
              {travelPackage.priceCurrency} {travelPackage.priceAmount.toLocaleString()}
            </p>
            <p className="mt-4 whitespace-pre-wrap text-[#4A3E31]">{travelPackage.description}</p>

            {tags.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-[#E3D6C1] bg-[#FBF7F1] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#8B6340]">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-6 grid gap-2 sm:grid-cols-3">
              <Button type="button" variant="outline" onClick={handleSave} className="border-[#D7C6A5] bg-white text-[#1A1714]">
                {savedPackageIds.has(travelPackage.id) ? <Check className="mr-2 size-4" /> : <Bookmark className="mr-2 size-4" />}
                {savedPackageIds.has(travelPackage.id) ? "Saved" : "Save package"}
              </Button>
              <Button type="button" onClick={() => handleInquiry("lead")} className="bg-[#1A1714] text-[#F7F0E6] hover:bg-[#2B2520]">
                Book Now
              </Button>
              <Button type="button" variant="outline" onClick={() => handleInquiry("contact")} className="border-[#D7C6A5] bg-white text-[#1A1714]">
                Ask a question
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-2xl text-[#1A1714]">Gallery</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {gallery.map((image) => (
              <img
                key={image.id}
                src={image.publicUrl || fallbackImage}
                alt={image.altText || travelPackage.title}
                className="h-40 w-full rounded-lg object-cover"
                loading="lazy"
                onError={(event) => {
                  (event.currentTarget as HTMLImageElement).src = fallbackImage;
                }}
              />
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-[#E3D6C1] bg-white/80 p-4">
            <h3 className="font-serif text-xl">Inclusions</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#4A3E31]">
              <li>Curated itinerary assistance</li>
              <li>Accommodation recommendations</li>
              <li>On-trip support window</li>
            </ul>
          </div>
          <div className="rounded-lg border border-[#E3D6C1] bg-white/80 p-4">
            <h3 className="font-serif text-xl">Exclusions</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#4A3E31]">
              <li>International flight tickets</li>
              <li>Visa or government fees</li>
              <li>Personal expenses and add-ons</li>
            </ul>
          </div>
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
