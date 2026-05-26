import { useEffect, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Bookmark, Clock3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchDestinationCategories, fetchRecentlyViewedDestinations, fetchSavedDestinations } from "@workspace/api-client-react";
import { useSessionRole } from "@/hooks/use-session-role";
import { setPageSeo } from "@/lib/seo";

const travelQuote = "A journey in India is never just a route. It is a shift in rhythm.";

const fallbackCategories = [
  "mountains",
  "treks",
  "beaches",
  "temples",
  "heritage",
  "wildlife",
  "spiritual",
  "adventure",
  "hill-stations",
  "desert",
  "waterfalls",
  "food-culture",
  "hidden-gems",
  "monsoon-trips",
];

export default function Dashboard() {
  const [, navigate] = useLocation();
  const session = useSessionRole();

  useEffect(() => {
    setPageSeo("Traveler Dashboard | Solora", "Plan, save, and revisit your India trip ideas.");
  }, []);

  useEffect(() => {
    if (session.status === "signed-out") {
      navigate("/auth", { replace: true });
    }
    if (session.status === "admin") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate, session.status]);

  const savedQuery = useQuery({ queryKey: ["user", "saved-destinations"], queryFn: fetchSavedDestinations, enabled: session.status === "user" });
  const recentQuery = useQuery({ queryKey: ["user", "recently-viewed"], queryFn: fetchRecentlyViewedDestinations, enabled: session.status === "user" });
  const categoriesQuery = useQuery({ queryKey: ["public", "categories"], queryFn: fetchDestinationCategories });

  const name = session.status === "user" || session.status === "admin" ? session.fullName ?? session.email.split("@")[0] : "Traveler";
  const categoryCount = categoriesQuery.data?.length ?? fallbackCategories.length;

  const topCategories = useMemo(() => {
    return (categoriesQuery.data ?? []).slice(0, 6);
  }, [categoriesQuery.data]);

  if (session.status === "loading" || session.status === "signed-out") {
    return (
      <main className="min-h-screen bg-[#0F0D0A] text-[#F7F0E6]">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">
          <p className="text-sm text-[#F7F0E6]/70">Loading your dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(201,169,110,0.18),transparent_34%),linear-gradient(180deg,#16120f_0%,#0f0d0a_40%,#f7f2ec_40%,#f7f2ec_100%)] text-[#1A1714]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-[28px] border border-white/8 bg-white/8 p-6 text-[#F7F0E6] backdrop-blur-2xl sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#C9A96E]">Traveler Dashboard</p>
              <h1 className="mt-3 font-serif text-4xl sm:text-5xl">Welcome back, {name}.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#F7F0E6]/72">{travelQuote}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#F7F0E6]/52">Saved trips</p>
                <p className="mt-2 text-2xl font-semibold">{savedQuery.data?.length ?? 0}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#F7F0E6]/52">Categories</p>
                <p className="mt-2 text-2xl font-semibold">{categoryCount}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#F7F0E6]/52">Recently viewed</p>
                <p className="mt-2 text-2xl font-semibold">{recentQuery.data?.length ?? 0}</p>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-[#E3D6C1] bg-white/85 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#8B6340]">Saved Trips</p>
                <h2 className="mt-2 font-serif text-3xl">Wishlist & planned escapes</h2>
              </div>
              <Bookmark className="size-5 text-[#8B6340]" />
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {(savedQuery.data ?? []).map((entry) => (
                <Link key={entry.destination.id} href={`/destinations/${entry.destination.slug}`} className="group overflow-hidden rounded-2xl border border-[#E3D6C1] bg-[#FFFDF9] transition hover:-translate-y-1 hover:shadow-lg">
                  <img src={entry.destination.heroImageUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"} alt={entry.destination.title} className="h-36 w-full object-cover" />
                  <div className="p-4">
                    <p className="text-sm font-medium text-[#1A1714]">{entry.destination.title}</p>
                    <p className="mt-1 text-xs text-[#6A5A47]">{entry.destination.state} · {entry.destination.city}</p>
                  </div>
                </Link>
              ))}
              {(savedQuery.data?.length ?? 0) === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#D7C6A5] bg-[#FBF7F1] p-6 text-sm text-[#5A4C3A]">
                  No saved trips yet. Start browsing destinations and tap the heart when something fits.
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-[28px] border border-[#E3D6C1] bg-white/85 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#8B6340]">Trip Planner</p>
                <h2 className="mt-2 font-serif text-3xl">Build My India Journey</h2>
              </div>
              <Sparkles className="size-5 text-[#8B6340]" />
            </div>
            <p className="mt-4 text-sm leading-7 text-[#4A3E31]">Use your saved places, recent views, and favorite categories to shape a richer itinerary.</p>
            <Button className="mt-6 h-11 w-full bg-[#1A1714] text-[#F7F0E6] hover:bg-[#2A241F]" onClick={() => navigate("/destinations") }>
              Build My India Journey
            </Button>
            <div className="mt-8 grid gap-3">
              <div className="rounded-2xl bg-[#F7F2EC] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8B6340]">Travel quote</p>
                <p className="mt-2 text-sm text-[#4A3E31]">"The best trips are the ones that leave room for surprise."</p>
              </div>
              <div className="rounded-2xl bg-[#F7F2EC] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8B6340]">Profile</p>
                <p className="mt-2 text-sm text-[#4A3E31]">{session.email}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-[#E3D6C1] bg-white/85 p-6 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#8B6340]">Categories Explorer</p>
              <h2 className="mt-2 font-serif text-3xl">Find your next India mood</h2>
            </div>
            <Link href="/destinations" className="inline-flex items-center gap-2 text-sm text-[#8B6340]">
              Browse all <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {(topCategories.length ? topCategories : fallbackCategories.map((slug, index) => ({ id: slug, title: slug.replace(/-/g, " "), slug, description: "Explore this travel mood.", imageUrl: "", sortOrder: index, createdAt: new Date(), updatedAt: new Date() }))).map((category) => (
              <Link key={category.slug} href={`/categories/${category.slug}`} className="group overflow-hidden rounded-2xl border border-[#E3D6C1] bg-[#FFFDF9] transition hover:-translate-y-1 hover:shadow-lg">
                <div className="h-36 bg-[linear-gradient(135deg,rgba(201,169,110,0.18),rgba(141,188,156,0.18))]" style={category.imageUrl ? { backgroundImage: `url(${category.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined} />
                <div className="p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-[#8B6340]">Category</p>
                  <h3 className="mt-2 font-serif text-2xl text-[#1A1714]">{category.title}</h3>
                  <p className="mt-2 text-sm text-[#5A4C3A]">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-[#E3D6C1] bg-white/85 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <Clock3 className="size-5 text-[#8B6340]" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#8B6340]">Recently Viewed</p>
                <h2 className="mt-2 font-serif text-3xl">Your recent India sparks</h2>
              </div>
            </div>
            <div className="mt-6 grid gap-3">
              {(recentQuery.data ?? []).map((entry) => (
                <Link key={entry.destination.id} href={`/destinations/${entry.destination.slug}`} className="flex items-center gap-4 rounded-2xl border border-[#E3D6C1] bg-[#FFFDF9] p-3 transition hover:-translate-y-1 hover:shadow-md">
                  <img src={entry.destination.heroImageUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"} alt={entry.destination.title} className="h-16 w-16 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[#1A1714]">{entry.destination.title}</p>
                    <p className="truncate text-sm text-[#6A5A47]">{entry.destination.shortDescription}</p>
                  </div>
                </Link>
              ))}
              {(recentQuery.data?.length ?? 0) === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#D7C6A5] bg-[#FBF7F1] p-6 text-sm text-[#5A4C3A]">
                  No recent views yet. Start exploring destinations to build your personalized feed.
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-[28px] border border-[#E3D6C1] bg-[#1A1714] p-6 text-[#F7F0E6] shadow-sm">
            <p className="text-xs uppercase tracking-[0.25em] text-[#C9A96E]">Trip Planner CTA</p>
            <h2 className="mt-2 font-serif text-3xl">Shape a route that feels like yours.</h2>
            <p className="mt-4 text-sm leading-7 text-[#F7F0E6]/72">Add destinations, compare moods, and save what moves you. Your dashboard will keep the journey close.</p>
            <Button className="mt-6 h-11 bg-[#C9A96E] text-[#1A1714] hover:bg-[#d7b777]" onClick={() => navigate("/destinations") }>
              Build My India Journey
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
