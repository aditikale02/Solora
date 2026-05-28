import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchCategoryBySlug } from "@workspace/api-client-react";
import { setPageSeo } from "@/lib/seo";

const fallbackImage = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80";

export default function CategoryDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const categoryQuery = useQuery({
    queryKey: ["public", "category", slug],
    queryFn: () => fetchCategoryBySlug(String(slug)),
    enabled: Boolean(slug),
  });

  useEffect(() => {
    if (categoryQuery.data) {
      setPageSeo(`${categoryQuery.data.category.title} | Solora`, categoryQuery.data.category.description);
    }
  }, [categoryQuery.data]);

  if (categoryQuery.isLoading) {
    return <main className="min-h-screen bg-[#F7F2EC] px-4 py-10 md:px-8"><div className="mx-auto max-w-5xl animate-pulse space-y-4"><div className="h-60 rounded-3xl bg-[#EFE4D4]" /><div className="h-8 w-2/3 rounded bg-[#EFE4D4]" /></div></main>;
  }

  if (categoryQuery.isError || !categoryQuery.data) {
    return <main className="min-h-screen bg-[#F7F2EC] px-4 py-10 md:px-8"><div className="mx-auto max-w-5xl rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">Category not found.</div></main>;
  }

  const { category, destinations } = categoryQuery.data;

  return (
    <main className="min-h-screen bg-[#F7F2EC] px-4 py-10 text-[#1A1714] md:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/destinations" className="text-sm text-[#8B6340] underline-offset-4 hover:underline">Back to destinations</Link>
        <section className="mt-4 overflow-hidden rounded-[28px] border border-[#E3D6C1] bg-white/85 shadow-sm">
          <img
            src={category.imageUrl || fallbackImage}
            alt={category.title}
            className="h-[280px] w-full object-cover"
          />
          <div className="p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[#8B6340]">Category</p>
            <h1 className="mt-2 font-serif text-5xl">{category.title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5A4C3A]">{category.description}</p>
          </div>
        </section>
        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {destinations.map((destination) => (
            <Link key={destination.id} href={`/destinations/${destination.slug}`} className="overflow-hidden rounded-[24px] border border-[#E3D6C1] bg-white/85 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <img src={destination.heroImageUrl || fallbackImage} alt={destination.title} className="h-52 w-full object-cover" />
              <div className="p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-[#8B6340]">{destination.state} · {destination.city}</p>
                <h2 className="mt-2 font-serif text-3xl">{destination.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-[#5A4C3A]">{destination.shortDescription}</p>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
