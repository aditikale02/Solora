import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicPackageBySlug } from "@workspace/api-client-react";
import { useLeadInquiry } from "@/components/lead/LeadInquiryProvider";
import { setPageSeo } from "@/lib/seo";

const fallbackImage = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80";

export default function PackageDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { openInquiry } = useLeadInquiry();

  const packageQuery = useQuery({
    queryKey: ["public", "package", slug],
    queryFn: () => fetchPublicPackageBySlug(String(slug)),
    enabled: Boolean(slug),
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
            <p className="mt-2 text-sm text-[#6A5A47]">{travelPackage.destinationName ?? "Destination"} · {travelPackage.durationDays} days</p>
            <p className="mt-2 text-sm font-medium text-[#1A1714]">{travelPackage.priceCurrency} {travelPackage.priceAmount.toLocaleString()}</p>
            <p className="mt-4 whitespace-pre-wrap text-[#4A3E31]">{travelPackage.description}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => openInquiry({ mode: "lead", source: "website" })}
                className="rounded-md bg-[#1A1714] px-4 py-2 text-sm text-[#F7F0E6]"
              >
                Inquire now
              </button>
              <button
                type="button"
                onClick={() => openInquiry({ mode: "contact", source: "website", subject: `Question about ${travelPackage.title}` })}
                className="rounded-md border border-[#D7C6A5] bg-white px-4 py-2 text-sm text-[#1A1714]"
              >
                Ask a question
              </button>
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
    </main>
  );
}
