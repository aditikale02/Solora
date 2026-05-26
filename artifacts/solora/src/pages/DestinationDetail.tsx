import { useEffect } from "react";
import { Link, useParams, useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookmarkPlus, Heart, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchPublicDestinationBySlug, recordRecentlyViewed, saveDestination, unsaveDestination } from "@workspace/api-client-react";
import { useSessionRole } from "@/hooks/use-session-role";
import { setPageSeo } from "@/lib/seo";
import { toast } from "sonner";

const fallbackImage = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80";

export default function DestinationDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const session = useSessionRole();

  const destinationQuery = useQuery({
    queryKey: ["public", "destination", slug],
    queryFn: () => fetchPublicDestinationBySlug(String(slug)),
    enabled: Boolean(slug),
  });

  useEffect(() => {
    if (destinationQuery.data) {
      setPageSeo(`${destinationQuery.data.destination.title} | Solora`, destinationQuery.data.destination.shortDescription);
    }
  }, [destinationQuery.data]);

  useEffect(() => {
    if (session.status === "user" && destinationQuery.data?.destination.id) {
      recordRecentlyViewed(destinationQuery.data.destination.id).catch(() => undefined);
    }
  }, [destinationQuery.data?.destination.id, session.status]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (session.status === "signed-out") {
        navigate(`/auth?next=/destinations/${slug}`);
        return null;
      }
      if (!destinationQuery.data) return null;
      return saveDestination(destinationQuery.data.destination.id);
    },
    onSuccess: async () => {
      toast.success("Saved to your trips.");
      await queryClient.invalidateQueries({ queryKey: ["user", "saved-destinations"] });
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: async () => {
      if (session.status === "signed-out") {
        navigate(`/auth?next=/destinations/${slug}`);
        return null;
      }
      if (!destinationQuery.data) return null;
      return unsaveDestination(destinationQuery.data.destination.id);
    },
    onSuccess: async () => {
      toast.success("Removed from saved trips.");
      await queryClient.invalidateQueries({ queryKey: ["user", "saved-destinations"] });
    },
  });

  if (destinationQuery.isLoading) {
    return <main className="min-h-screen bg-[#F7F2EC] px-4 py-10 md:px-8"><div className="mx-auto max-w-5xl animate-pulse space-y-4"><div className="h-72 rounded-3xl bg-[#EFE4D4]" /><div className="h-8 w-2/3 rounded bg-[#EFE4D4]" /><div className="h-4 w-1/2 rounded bg-[#EFE4D4]" /></div></main>;
  }

  if (destinationQuery.isError || !destinationQuery.data) {
    return <main className="min-h-screen bg-[#F7F2EC] px-4 py-10 md:px-8"><div className="mx-auto max-w-5xl rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">Destination not found.</div></main>;
  }

  const { destination, images } = destinationQuery.data;
  const gallery = images.length > 0 ? images : [{ id: destination.id, destinationId: destination.id, storagePath: "", publicUrl: destination.heroImageUrl || fallbackImage, altText: destination.title, sortOrder: 0, isHero: true, createdAt: new Date() }];

  return (
    <main className="min-h-screen bg-[#F7F2EC] px-4 py-10 text-[#1A1714] md:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/destinations" className="text-sm text-[#8B6340] underline-offset-4 hover:underline">Back to destinations</Link>

        <section className="mt-4 overflow-hidden rounded-[28px] border border-[#E3D6C1] bg-white/85 shadow-sm">
          <img src={destination.heroImageUrl || fallbackImage} alt={destination.title} className="h-[360px] w-full object-cover" />
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3 text-sm text-[#6A5A47]">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#F6EFE4] px-3 py-1"><MapPin className="size-4" />{destination.state} · {destination.city}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#F6EFE4] px-3 py-1"><Star className="size-4" />{destination.bestSeason || "All seasons"}</span>
            </div>
            <h1 className="mt-4 font-serif text-5xl">{destination.title}</h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-[#5A4C3A]">{destination.shortDescription}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button className="bg-[#1A1714] text-[#F7F0E6] hover:bg-[#2A241F]" onClick={() => saveMutation.mutate()}>
                <BookmarkPlus className="mr-2 size-4" />Save Destination
              </Button>
              <Button variant="outline" className="border-[#D7C6A5] bg-white" onClick={() => unsaveMutation.mutate()}>
                <Heart className="mr-2 size-4" />Unsave
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[28px] border border-[#E3D6C1] bg-white/85 p-6 shadow-sm">
            <h2 className="font-serif text-3xl">About this place</h2>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#4A3E31]">{destination.longDescription || destination.shortDescription}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#F7F2EC] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8B6340]">Estimated Budget</p>
                <p className="mt-2 text-sm">{destination.estimatedBudget || "Custom"}</p>
              </div>
              <div className="rounded-2xl bg-[#F7F2EC] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8B6340]">Ideal Duration</p>
                <p className="mt-2 text-sm">{destination.idealDurationDays} days</p>
              </div>
            </div>
          </div>
          <div className="rounded-[28px] border border-[#E3D6C1] bg-[#1A1714] p-6 text-[#F7F0E6] shadow-sm">
            <p className="text-xs uppercase tracking-[0.25em] text-[#C9A96E]">Travel tips</p>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#F7F0E6]/75">{destination.travelTips || "Ask the Solora team to personalize this route."}</p>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-3xl">Gallery</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {gallery.map((image) => (
              <img key={image.id} src={image.publicUrl || fallbackImage} alt={image.altText || destination.title} className="h-52 w-full rounded-3xl object-cover" />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
