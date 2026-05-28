import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Boxes,
  FolderTree,
  ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  MapPin,
  PackagePlus,
  Users,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/ui/combobox";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { signOutAdmin } from "@/lib/admin-auth";
import { useAdminSession } from "@/hooks/use-admin-session";
import { toast } from "sonner";
import {
  createAdminCategory,
  createAdminDestination,
  createAdminPackage,
  deleteAdminCategory,
  deleteAdminDestination,
  deleteAdminPackage,
  fetchAdminCategories,
  fetchAdminDestinations,
  fetchAdminInquiries,
  fetchAdminPackages,
  updateAdminCategory,
  updateAdminDestination,
  updateAdminPackage,
} from "@workspace/api-client-react";
import type { DestinationCategoryRecord, DestinationRecord, PackageRecord } from "@workspace/api-zod";

const panels = [
  { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
  { id: "packages" as const, label: "Packages", icon: PackagePlus },
  { id: "destinations" as const, label: "Destinations", icon: MapPin },
  { id: "categories" as const, label: "Categories", icon: FolderTree },
  { id: "inquiries" as const, label: "Inquiries", icon: Inbox },
  { id: "users" as const, label: "Users", icon: Users },
  { id: "uploads" as const, label: "Uploads", icon: ImageIcon },
];

type ActivePanel = (typeof panels)[number]["id"];

const emptyPackageForm = {
  destinationId: "",
  title: "",
  description: "",
  durationDays: "5",
  priceAmount: "0",
  priceCurrency: "INR",
  features: "",
  heroImageUrl: "",
  isActive: true,
};

const emptyDestinationForm = {
  categoryId: "",
  title: "",
  state: "",
  city: "",
  description: "",
  shortDescription: "",
  longDescription: "",
  tags: "",
  heroImageUrl: "",
  bestSeason: "",
  estimatedBudget: "",
  idealDurationDays: "3",
  travelTips: "",
  featured: false,
  isActive: true,
};

const emptyCategoryForm = {
  title: "",
  description: "",
  imageUrl: "",
  sortOrder: "0",
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function splitList(value: string): string[] {
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#D7C6A5] bg-white/80 p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="font-serif text-2xl text-[#1A1714]">{title}</h2>
        {description ? <p className="mt-1 text-sm text-[#6A5A47]">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export default function AdminDashboardView() {
  const [, navigate] = useLocation();
  const session = useAdminSession();
  const queryClient = useQueryClient();
  const [activePanel, setActivePanel] = useState<ActivePanel>("dashboard");
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [packageForm, setPackageForm] = useState(emptyPackageForm);
  const [editingDestinationId, setEditingDestinationId] = useState<string | null>(null);
  const [destinationForm, setDestinationForm] = useState(emptyDestinationForm);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [uploadPackageId, setUploadPackageId] = useState<string>("");
  const [uploadDestinationId, setUploadDestinationId] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isQuickDestinationOpen, setIsQuickDestinationOpen] = useState(false);

  const categoriesQuery = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: fetchAdminCategories,
  });
  const destinationsQuery = useQuery({
    queryKey: ["admin", "destinations"],
    queryFn: fetchAdminDestinations,
  });
  const packagesQuery = useQuery({
    queryKey: ["admin", "packages"],
    queryFn: fetchAdminPackages,
  });
  const inquiriesQuery = useQuery({
    queryKey: ["admin", "inquiries"],
    queryFn: fetchAdminInquiries,
  });

  const selectedPackage = useMemo(
    () => packagesQuery.data?.find((item) => item.id === editingPackageId),
    [editingPackageId, packagesQuery.data],
  );
  const selectedDestination = useMemo(
    () => destinationsQuery.data?.find((item) => item.id === editingDestinationId),
    [editingDestinationId, destinationsQuery.data],
  );
  const selectedCategory = useMemo(
    () => categoriesQuery.data?.find((item) => item.id === editingCategoryId),
    [editingCategoryId, categoriesQuery.data],
  );
  const uploadPackage = useMemo(
    () => packagesQuery.data?.find((item) => item.id === uploadPackageId),
    [packagesQuery.data, uploadPackageId],
  );
  const uploadDestination = useMemo(
    () => destinationsQuery.data?.find((item) => item.id === uploadDestinationId),
    [destinationsQuery.data, uploadDestinationId],
  );

  const createCategoryMutation = useMutation({
    mutationFn: createAdminCategory,
    onSuccess: async (category) => {
      toast.success("Category created successfully.");
      setEditingCategoryId(null);
      setCategoryForm(emptyCategoryForm);
      await queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      setStatusMessage(`Created category: ${category.title}`);
    },
    onError: (error: any) => {
      const errMsg = error?.data?.message || error?.message || "Could not create category.";
      toast.error(errMsg);
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: typeof categoryForm }) =>
      updateAdminCategory(id, {
        title: payload.title,
        description: payload.description,
        imageUrl: payload.imageUrl,
        sortOrder: Number(payload.sortOrder),
      }),
    onSuccess: async (category) => {
      toast.success("Category updated successfully.");
      setEditingCategoryId(null);
      setCategoryForm(emptyCategoryForm);
      await queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      setStatusMessage(`Updated category: ${category.title}`);
    },
    onError: (error: any) => {
      const errMsg = error?.data?.message || error?.message || "Could not update category.";
      toast.error(errMsg);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteAdminCategory,
    onSuccess: async () => {
      toast.success("Category deleted successfully.");
      await queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
    onError: (error: any) => {
      const errMsg = error?.data?.message || error?.message || "Could not delete category.";
      toast.error(errMsg);
    },
  });

  const createDestinationMutation = useMutation({
    mutationFn: async (payload: typeof destinationForm) =>
      createAdminDestination({
        categoryId: payload.categoryId || null,
        title: payload.title,
        description: payload.description || payload.shortDescription || "",
        shortDescription: payload.shortDescription || payload.description || "",
        longDescription: payload.longDescription,
        state: payload.state,
        city: payload.city,
        tags: payload.tags,
        heroImageUrl: payload.heroImageUrl,
        bestSeason: payload.bestSeason,
        estimatedBudget: payload.estimatedBudget,
        idealDurationDays: Number(payload.idealDurationDays),
        travelTips: payload.travelTips,
        featured: payload.featured,
        isActive: payload.isActive,
      }),
    onSuccess: async (destination) => {
      toast.success("Destination created successfully.");
      setEditingDestinationId(null);
      setDestinationForm(emptyDestinationForm);
      setPackageForm((current) => ({ ...current, destinationId: destination.id }));
      setUploadDestinationId(destination.id);
      setIsQuickDestinationOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["admin", "destinations"] });
      setStatusMessage(`Created destination: ${destination.title}`);
    },
    onError: (error: any) => {
      const errMsg = error?.data?.message || error?.message || "Could not create destination.";
      toast.error(errMsg);
    },
  });

  const updateDestinationMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: typeof destinationForm }) =>
      updateAdminDestination(id, {
        categoryId: payload.categoryId || null,
        title: payload.title,
        description: payload.description || payload.shortDescription || "",
        state: payload.state,
        city: payload.city,
        shortDescription: payload.shortDescription || payload.description || "",
        longDescription: payload.longDescription,
        tags: payload.tags,
        heroImageUrl: payload.heroImageUrl,
        bestSeason: payload.bestSeason,
        estimatedBudget: payload.estimatedBudget,
        idealDurationDays: Number(payload.idealDurationDays),
        travelTips: payload.travelTips,
        featured: payload.featured,
        isActive: payload.isActive,
      }),
    onSuccess: async (destination) => {
      toast.success("Destination updated successfully.");
      setEditingDestinationId(null);
      setDestinationForm(emptyDestinationForm);
      setPackageForm((current) => ({ ...current, destinationId: destination.id }));
      setUploadDestinationId(destination.id);
      await queryClient.invalidateQueries({ queryKey: ["admin", "destinations"] });
      setStatusMessage(`Updated destination: ${destination.title}`);
    },
    onError: (error: any) => {
      const errMsg = error?.data?.message || error?.message || "Could not update destination.";
      toast.error(errMsg);
    },
  });

  const deleteDestinationMutation = useMutation({
    mutationFn: deleteAdminDestination,
    onSuccess: async () => {
      toast.success("Destination deleted successfully.");
      if (editingDestinationId) {
        setEditingDestinationId(null);
        setDestinationForm(emptyDestinationForm);
      }
      await queryClient.invalidateQueries({ queryKey: ["admin", "destinations"] });
    },
    onError: (error: any) => {
      const errMsg = error?.data?.message || error?.message || "Could not delete destination.";
      toast.error(errMsg);
    },
  });

  const savePackageMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        destinationId: packageForm.destinationId,
        title: packageForm.title,
        description: packageForm.description,
        durationDays: Number(packageForm.durationDays),
        priceAmount: Number(packageForm.priceAmount),
        priceCurrency: packageForm.priceCurrency,
        features: packageForm.features,
        heroImageUrl: packageForm.heroImageUrl,
        isActive: packageForm.isActive,
      };

      return editingPackageId ? updateAdminPackage(editingPackageId, payload) : createAdminPackage(payload);
    },
    onSuccess: async (travelPackage) => {
      toast.success("Package saved successfully.");
      setEditingPackageId(null);
      setPackageForm(emptyPackageForm);
      setUploadPackageId(travelPackage.id);
      await queryClient.invalidateQueries({ queryKey: ["admin", "packages"] });
      setStatusMessage(`Saved package: ${travelPackage.title}`);
    },
    onError: (error: any) => {
      const errMsg = error?.data?.message || error?.message || "Could not save package.";
      toast.error(errMsg);
    },
  });

  const deletePackageMutation = useMutation({
    mutationFn: deleteAdminPackage,
    onSuccess: async () => {
      toast.success("Package deleted successfully.");
      await queryClient.invalidateQueries({ queryKey: ["admin", "packages"] });
    },
    onError: (error: any) => {
      const errMsg = error?.data?.message || error?.message || "Could not delete package.";
      toast.error(errMsg);
    },
  });

  async function handleLogout() {
    await signOutAdmin();
    navigate("/admin/login", { replace: true });
  }

  function editPackage(travelPackage: PackageRecord) {
    setEditingPackageId(travelPackage.id);
    setPackageForm({
      destinationId: travelPackage.destinationId,
      title: travelPackage.title,
      description: travelPackage.description,
      durationDays: String(travelPackage.durationDays),
      priceAmount: String(travelPackage.priceAmount),
      priceCurrency: travelPackage.priceCurrency,
      features: travelPackage.features,
      heroImageUrl: travelPackage.heroImageUrl,
      isActive: travelPackage.isActive,
    });
    setActivePanel("packages");
  }

  function editDestination(destination: DestinationRecord) {
    setEditingDestinationId(destination.id);
    setDestinationForm({
      categoryId: destination.categoryId ?? "",
      title: destination.title,
      state: destination.state,
      city: destination.city,
      description: destination.description,
      shortDescription: destination.shortDescription,
      longDescription: destination.longDescription,
      tags: destination.tags,
      heroImageUrl: destination.heroImageUrl,
      bestSeason: destination.bestSeason,
      estimatedBudget: destination.estimatedBudget,
      idealDurationDays: String(destination.idealDurationDays),
      travelTips: destination.travelTips,
      featured: destination.featured,
      isActive: destination.isActive,
    });
    setActivePanel("destinations");
  }

  function editCategory(category: DestinationCategoryRecord) {
    setEditingCategoryId(category.id);
    setCategoryForm({
      title: category.title,
      description: category.description,
      imageUrl: category.imageUrl,
      sortOrder: String(category.sortOrder),
    });
    setActivePanel("categories");
  }

  function resetPackageForm() {
    setEditingPackageId(null);
    setPackageForm(emptyPackageForm);
  }

  function resetDestinationForm() {
    setEditingDestinationId(null);
    setDestinationForm(emptyDestinationForm);
  }

  function openQuickDestinationDialog() {
    setEditingDestinationId(null);
    setDestinationForm(emptyDestinationForm);
    setIsQuickDestinationOpen(true);
    setActivePanel("packages");
  }

  function resetCategoryForm() {
    setEditingCategoryId(null);
    setCategoryForm(emptyCategoryForm);
  }

  const summaryCards = [
    { label: "Packages", value: packagesQuery.data?.length ?? 0, icon: PackagePlus },
    { label: "Destinations", value: destinationsQuery.data?.length ?? 0, icon: MapPin },
    { label: "Categories", value: categoriesQuery.data?.length ?? 0, icon: FolderTree },
    { label: "Inquiries", value: inquiriesQuery.data?.length ?? 0, icon: Inbox },
  ];

  return (
    <main className="min-h-screen bg-[#F7F2EC] text-[#1A1714]">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-[#D7C6A5] bg-[#1A1714] p-5 text-[#F7F0E6] lg:border-b-0 lg:border-r">
          <div className="mb-8">
            <p className="font-serif text-3xl leading-none">Solora</p>
            <p className="mt-2 text-sm text-[#F7F0E6]/60">{session.status === "signed-in" ? session.email : "Admin"}</p>
          </div>

          <nav className="grid gap-2">
            {panels.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === "users") {
                    setActivePanel("users");
                    return;
                  }
                  setActivePanel(item.id);
                }}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition ${
                  activePanel === item.id ? "bg-[#C9A96E] text-[#1A1714]" : "text-[#F7F0E6]/75 hover:bg-white/10"
                }`}
              >
                <item.icon className="size-4" />
                {item.label}
              </button>
            ))}
          </nav>

          <Button type="button" onClick={handleLogout} className="mt-8 w-full bg-[#F7F0E6] text-[#1A1714] hover:bg-white">
            <LogOut className="mr-2 size-4" />
            Logout
          </Button>
        </aside>

        <section className="p-5 lg:p-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-[#8B6340]">Operations</p>
              <h1 className="mt-2 font-serif text-4xl">Admin Dashboard</h1>
            </div>
            <Button type="button" variant="outline" className="border-[#D7C6A5] bg-white" onClick={() => setActivePanel("dashboard")}>Dashboard</Button>
          </div>

          {statusMessage ? (
            <p className="mb-5 rounded-md border border-[#D7C6A5] bg-white px-4 py-3 text-sm text-[#1A1714]">{statusMessage}</p>
          ) : null}

          {activePanel === "dashboard" ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {summaryCards.map((card) => (
                <div key={card.label} className="rounded-2xl border border-[#D7C6A5] bg-white/85 p-5">
                  <div className="flex items-center justify-between text-sm text-[#8B6340]">
                    <span>{card.label}</span>
                    <card.icon className="size-4" />
                  </div>
                  <p className="mt-3 font-serif text-4xl text-[#1A1714]">{card.value}</p>
                </div>
              ))}
            </div>
          ) : null}

          {activePanel === "packages" ? (
            <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
              <SectionCard title={editingPackageId ? "Edit Package" : "Create Package"} description="Packages are public-facing and can be uploaded with hero images after save.">
                <form
                  className="grid gap-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    savePackageMutation.mutate();
                  }}
                >
                  <div className="grid gap-2">
                    <Label>Destination</Label>
                    <Combobox
                      options={destinationsQuery.data?.map((destination) => ({
                        value: destination.id,
                        label: destination.title,
                      })) ?? []}
                      value={packageForm.destinationId}
                      onValueChange={(value) => setPackageForm((current) => ({ ...current, destinationId: value }))}
                      placeholder="Select destination"
                      searchPlaceholder="Search destinations..."
                      emptyText="No destinations found."
                      allowCreate
                      onCreateNew={openQuickDestinationDialog}
                      createNewLabel="+ Create New Destination"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Title</Label>
                    <Input value={packageForm.title} onChange={(event) => setPackageForm((current) => ({ ...current, title: event.target.value }))} className="bg-white text-[#1A1714] caret-[#1A1714]" required />
                  </div>

                  <div className="grid gap-2">
                    <Label>Description</Label>
                    <Textarea value={packageForm.description} onChange={(event) => setPackageForm((current) => ({ ...current, description: event.target.value }))} className="min-h-28 bg-white text-[#1A1714] caret-[#1A1714]" required />
                  </div>

                  <div className="grid gap-2">
                    <Label>Included features</Label>
                    <Textarea value={packageForm.features} onChange={(event) => setPackageForm((current) => ({ ...current, features: event.target.value }))} className="min-h-24 bg-white text-[#1A1714] caret-[#1A1714]" placeholder="Meals, stays, transfers, guides" />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="grid gap-2">
                      <Label>Days</Label>
                      <Input type="number" min="1" value={packageForm.durationDays} onChange={(event) => setPackageForm((current) => ({ ...current, durationDays: event.target.value }))} className="bg-white text-[#1A1714] caret-[#1A1714]" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Price</Label>
                      <Input type="number" min="0" value={packageForm.priceAmount} onChange={(event) => setPackageForm((current) => ({ ...current, priceAmount: event.target.value }))} className="bg-white text-[#1A1714] caret-[#1A1714]" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Currency</Label>
                      <Input value={packageForm.priceCurrency} onChange={(event) => setPackageForm((current) => ({ ...current, priceCurrency: event.target.value }))} className="bg-white text-[#1A1714] caret-[#1A1714]" />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Hero image</Label>
                    {packageForm.heroImageUrl ? (
                      <div className="relative group overflow-hidden rounded-xl border border-[#D7C6A5]">
                        <img src={packageForm.heroImageUrl} alt="Hero preview" className="h-44 w-full object-cover transition duration-300 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition gap-2">
                          <Button type="button" variant="destructive" size="sm" onClick={() => setPackageForm((current) => ({ ...current, heroImageUrl: "" }))}>
                            Remove Image
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <ImageUploadField
                        targetType="generic"
                        title="Upload package hero image"
                        targetId="packages"
                        onUploaded={(publicUrl) => setPackageForm((current) => ({ ...current, heroImageUrl: publicUrl }))}
                      />
                    )}
                  </div>

                  <label className="flex items-center gap-2 text-sm text-[#1A1714]">
                    <input type="checkbox" checked={packageForm.isActive} onChange={(event) => setPackageForm((current) => ({ ...current, isActive: event.target.checked }))} />
                    Active package
                  </label>

                  <div className="flex flex-wrap gap-2">
                    <Button type="submit" disabled={savePackageMutation.isPending} className="bg-[#1A1714] text-[#F7F0E6] hover:bg-[#2B2520]">
                      {savePackageMutation.isPending ? "Saving..." : "Save package"}
                    </Button>
                    {editingPackageId ? (
                      <Button type="button" variant="outline" onClick={resetPackageForm} className="border-[#D7C6A5] bg-white">
                        Cancel
                      </Button>
                    ) : null}
                  </div>
                </form>
              </SectionCard>

              <div className="grid gap-4">
                {packagesQuery.isLoading ? <div className="rounded-2xl border border-[#D7C6A5] bg-white/85 p-5 text-sm text-[#6A5A47]">Loading packages...</div> : null}
                {!packagesQuery.isLoading && (packagesQuery.data?.length ?? 0) === 0 ? <div className="rounded-2xl border border-[#D7C6A5] bg-white/85 p-5 text-sm text-[#6A5A47]">No packages yet. Create one to start testing the public flow.</div> : null}
                {packagesQuery.data?.map((travelPackage) => (
                  <article key={travelPackage.id} className="grid gap-4 rounded-2xl border border-[#D7C6A5] bg-white/85 p-4 md:grid-cols-[150px_1fr_auto]">
                    {travelPackage.heroImageUrl ? (
                      <img src={travelPackage.heroImageUrl} alt={travelPackage.title} className="h-32 w-full rounded-xl object-cover" />
                    ) : (
                      <div className="flex h-32 items-center justify-center rounded-xl bg-[#E8DED0] text-[#8B6340]"><ImageIcon className="size-6" /></div>
                    )}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-serif text-2xl text-[#1A1714]">{travelPackage.title}</h3>
                        <span className={`rounded-full px-2 py-1 text-[11px] uppercase tracking-[0.18em] ${travelPackage.isActive ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-700"}`}>
                          {travelPackage.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-sm text-[#6A5A47]">{travelPackage.destinationName ?? "Destination"} · {travelPackage.durationDays} days · {travelPackage.priceCurrency} {travelPackage.priceAmount.toLocaleString()}</p>
                      <p className="mt-2 text-sm text-[#4A3E31]">{travelPackage.description}</p>
                      {travelPackage.features ? <p className="mt-2 text-xs text-[#8B6340]">{splitList(travelPackage.features).join(" · ")}</p> : null}
                    </div>
                    <div className="flex flex-wrap gap-2 md:flex-col md:items-stretch">
                      <Button type="button" variant="outline" className="border-[#D7C6A5] bg-white" onClick={() => editPackage(travelPackage)}>Edit</Button>
                      <Button type="button" variant="outline" className="border-[#D7C6A5] bg-white" onClick={() => updateAdminPackage(travelPackage.id, { isActive: !travelPackage.isActive }).then(() => queryClient.invalidateQueries({ queryKey: ["admin", "packages"] }))}> {travelPackage.isActive ? "Deactivate" : "Activate"}</Button>
                      <Button type="button" variant="destructive" onClick={() => deletePackageMutation.mutate(travelPackage.id)}>Delete</Button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}

          {activePanel === "destinations" ? (
            <div className="grid gap-6 xl:grid-cols-[460px_1fr]">
              <SectionCard title={editingDestinationId ? "Edit Destination" : "Create Destination"} description="Create destinations here, then attach hero or gallery images from the upload panel.">
                <form
                  className="grid gap-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (editingDestinationId) {
                      updateDestinationMutation.mutate({ id: editingDestinationId, payload: destinationForm });
                    } else {
                      createDestinationMutation.mutate(destinationForm as never);
                    }
                  }}
                >
                  <div className="grid gap-2">
                    <Label>Category</Label>
                    <Combobox
                      options={categoriesQuery.data?.map((category) => ({
                        value: category.id,
                        label: category.title,
                      })) ?? []}
                      value={destinationForm.categoryId}
                      onValueChange={(value) => setDestinationForm((current) => ({ ...current, categoryId: value }))}
                      placeholder="No category"
                      searchPlaceholder="Search categories..."
                      emptyText="No categories found."
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Name</Label>
                    <Input value={destinationForm.title} onChange={(event) => setDestinationForm((current) => ({ ...current, title: event.target.value }))} className="bg-white text-[#1A1714] caret-[#1A1714]" required />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label>State</Label>
                      <Input value={destinationForm.state} onChange={(event) => setDestinationForm((current) => ({ ...current, state: event.target.value }))} className="bg-white text-[#1A1714] caret-[#1A1714]" />
                    </div>
                    <div className="grid gap-2">
                      <Label>City</Label>
                      <Input value={destinationForm.city} onChange={(event) => setDestinationForm((current) => ({ ...current, city: event.target.value }))} className="bg-white text-[#1A1714] caret-[#1A1714]" />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Short description</Label>
                    <Textarea value={destinationForm.shortDescription} onChange={(event) => setDestinationForm((current) => ({ ...current, shortDescription: event.target.value }))} className="min-h-20 bg-white text-[#1A1714] caret-[#1A1714]" />
                  </div>

                  <div className="grid gap-2">
                    <Label>Long description</Label>
                    <Textarea value={destinationForm.longDescription} onChange={(event) => setDestinationForm((current) => ({ ...current, longDescription: event.target.value }))} className="min-h-28 bg-white text-[#1A1714] caret-[#1A1714]" />
                  </div>

                  <div className="grid gap-2">
                    <Label>Tags</Label>
                    <Input value={destinationForm.tags} onChange={(event) => setDestinationForm((current) => ({ ...current, tags: event.target.value }))} className="bg-white text-[#1A1714] caret-[#1A1714]" placeholder="Manali, treks, snow" />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="grid gap-2">
                      <Label>Best season</Label>
                      <Input value={destinationForm.bestSeason} onChange={(event) => setDestinationForm((current) => ({ ...current, bestSeason: event.target.value }))} className="bg-white text-[#1A1714] caret-[#1A1714]" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Budget</Label>
                      <Input value={destinationForm.estimatedBudget} onChange={(event) => setDestinationForm((current) => ({ ...current, estimatedBudget: event.target.value }))} className="bg-white text-[#1A1714] caret-[#1A1714]" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Ideal duration</Label>
                      <Input type="number" min="1" value={destinationForm.idealDurationDays} onChange={(event) => setDestinationForm((current) => ({ ...current, idealDurationDays: event.target.value }))} className="bg-white text-[#1A1714] caret-[#1A1714]" />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Travel tips</Label>
                    <Textarea value={destinationForm.travelTips} onChange={(event) => setDestinationForm((current) => ({ ...current, travelTips: event.target.value }))} className="min-h-24 bg-white text-[#1A1714] caret-[#1A1714]" />
                  </div>

                  <div className="grid gap-2">
                    <Label>Hero image</Label>
                    {destinationForm.heroImageUrl ? (
                      <div className="relative group overflow-hidden rounded-xl border border-[#D7C6A5]">
                        <img src={destinationForm.heroImageUrl} alt="Hero preview" className="h-44 w-full object-cover transition duration-300 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition gap-2">
                          <Button type="button" variant="destructive" size="sm" onClick={() => setDestinationForm((current) => ({ ...current, heroImageUrl: "" }))}>
                            Remove Image
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <ImageUploadField
                        targetType="generic"
                        title="Upload destination hero image"
                        targetId="destinations"
                        onUploaded={(publicUrl) => setDestinationForm((current) => ({ ...current, heroImageUrl: publicUrl }))}
                      />
                    )}
                  </div>

                  <label className="flex items-center gap-2 text-sm text-[#1A1714]"><input type="checkbox" checked={destinationForm.featured} onChange={(event) => setDestinationForm((current) => ({ ...current, featured: event.target.checked }))} />Featured destination</label>
                  <label className="flex items-center gap-2 text-sm text-[#1A1714]"><input type="checkbox" checked={destinationForm.isActive} onChange={(event) => setDestinationForm((current) => ({ ...current, isActive: event.target.checked }))} />Active destination</label>

                  <div className="flex flex-wrap gap-2">
                    <Button type="submit" disabled={createDestinationMutation.isPending || updateDestinationMutation.isPending} className="bg-[#1A1714] text-[#F7F0E6] hover:bg-[#2B2520]">
                      {editingDestinationId ? "Update destination" : "Create destination"}
                    </Button>
                    {editingDestinationId ? (
                      <Button type="button" variant="outline" onClick={resetDestinationForm} className="border-[#D7C6A5] bg-white">Cancel</Button>
                    ) : null}
                  </div>
                </form>
              </SectionCard>

              <div className="grid gap-4">
                {destinationsQuery.data?.map((destination) => (
                  <article key={destination.id} className="grid gap-4 rounded-2xl border border-[#D7C6A5] bg-white/85 p-4 md:grid-cols-[150px_1fr_auto]">
                    {destination.heroImageUrl ? (
                      <img src={destination.heroImageUrl} alt={destination.title} className="h-32 w-full rounded-xl object-cover" />
                    ) : (
                      <div className="flex h-32 items-center justify-center rounded-xl bg-[#E8DED0] text-[#8B6340]"><MapPin className="size-6" /></div>
                    )}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-serif text-2xl text-[#1A1714]">{destination.title}</h3>
                        <span className={`rounded-full px-2 py-1 text-[11px] uppercase tracking-[0.18em] ${destination.isActive ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-700"}`}>{destination.isActive ? "Active" : "Inactive"}</span>
                        {destination.featured ? <span className="rounded-full bg-amber-100 px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-amber-800">Featured</span> : null}
                      </div>
                      <p className="text-sm text-[#6A5A47]">{destination.state || "—"} · {destination.city || "—"} · {destination.bestSeason || "All seasons"}</p>
                      <p className="mt-2 text-sm text-[#4A3E31]">{destination.shortDescription || destination.description || destination.longDescription}</p>
                      {destination.tags ? <p className="mt-2 text-xs text-[#8B6340]">{splitList(destination.tags).join(" · ")}</p> : null}
                    </div>
                    <div className="flex flex-wrap gap-2 md:flex-col md:items-stretch">
                      <Button type="button" variant="outline" className="border-[#D7C6A5] bg-white" onClick={() => editDestination(destination)}>Edit</Button>
                      <Button type="button" variant="outline" className="border-[#D7C6A5] bg-white" onClick={() => updateAdminDestination(destination.id, { title: destination.title, state: destination.state, city: destination.city, categoryId: destination.categoryId ?? null, description: destination.description, shortDescription: destination.shortDescription, longDescription: destination.longDescription, tags: destination.tags, heroImageUrl: destination.heroImageUrl, bestSeason: destination.bestSeason, estimatedBudget: destination.estimatedBudget, idealDurationDays: destination.idealDurationDays, travelTips: destination.travelTips, featured: !destination.featured, isActive: destination.isActive }).then(() => queryClient.invalidateQueries({ queryKey: ["admin", "destinations"] }))}>{destination.featured ? "Unfeature" : "Feature"}</Button>
                      <Button type="button" variant="destructive" onClick={() => deleteDestinationMutation.mutate(destination.id)}>Delete</Button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}

          {activePanel === "categories" ? (
            <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
              <SectionCard title={editingCategoryId ? "Edit Category" : "Create Category"} description="Categories power the destination browsing and package composer.">
                <form
                  className="grid gap-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    const payload = {
                      title: categoryForm.title,
                      description: categoryForm.description,
                      imageUrl: categoryForm.imageUrl,
                      sortOrder: Number(categoryForm.sortOrder),
                    };
                    if (editingCategoryId) {
                      updateCategoryMutation.mutate({ id: editingCategoryId, payload: categoryForm });
                    } else {
                      createCategoryMutation.mutate(payload);
                    }
                  }}
                >
                  <div className="grid gap-2">
                    <Label>Title</Label>
                    <Input value={categoryForm.title} onChange={(event) => setCategoryForm((current) => ({ ...current, title: event.target.value }))} className="bg-white text-[#1A1714] caret-[#1A1714]" required />
                  </div>
                  <div className="grid gap-2">
                    <Label>Description</Label>
                    <Textarea value={categoryForm.description} onChange={(event) => setCategoryForm((current) => ({ ...current, description: event.target.value }))} className="min-h-24 bg-white text-[#1A1714] caret-[#1A1714]" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Category image</Label>
                    {categoryForm.imageUrl ? (
                      <div className="relative group overflow-hidden rounded-xl border border-[#D7C6A5]">
                        <img src={categoryForm.imageUrl} alt="Category preview" className="h-44 w-full object-cover transition duration-300 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition gap-2">
                          <Button type="button" variant="destructive" size="sm" onClick={() => setCategoryForm((current) => ({ ...current, imageUrl: "" }))}>
                            Remove Image
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <ImageUploadField
                        targetType="generic"
                        title="Upload category image"
                        targetId="categories"
                        onUploaded={(publicUrl) => setCategoryForm((current) => ({ ...current, imageUrl: publicUrl }))}
                      />
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label>Sort order</Label>
                    <Input type="number" value={categoryForm.sortOrder} onChange={(event) => setCategoryForm((current) => ({ ...current, sortOrder: event.target.value }))} className="bg-white text-[#1A1714] caret-[#1A1714]" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button type="submit" className="bg-[#1A1714] text-[#F7F0E6] hover:bg-[#2B2520]">{editingCategoryId ? "Update category" : "Create category"}</Button>
                    {editingCategoryId ? <Button type="button" variant="outline" onClick={resetCategoryForm} className="border-[#D7C6A5] bg-white">Cancel</Button> : null}
                  </div>
                </form>
              </SectionCard>

              <div className="grid gap-4">
                {categoriesQuery.data?.map((category) => (
                  <article key={category.id} className="grid gap-4 rounded-2xl border border-[#D7C6A5] bg-white/85 p-4 md:grid-cols-[150px_1fr_auto]">
                    {category.imageUrl ? (
                      <img src={category.imageUrl} alt={category.title} className="h-32 w-full rounded-xl object-cover" />
                    ) : (
                      <div className="flex h-32 items-center justify-center rounded-xl bg-[#E8DED0] text-[#8B6340]"><Boxes className="size-6" /></div>
                    )}
                    <div>
                      <h3 className="font-serif text-2xl text-[#1A1714]">{category.title}</h3>
                      <p className="mt-1 text-sm text-[#6A5A47]">{category.description || "No description yet."}</p>
                      <p className="mt-2 text-xs text-[#8B6340]">Sort order: {category.sortOrder}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 md:flex-col md:items-stretch">
                      <Button type="button" variant="outline" className="border-[#D7C6A5] bg-white" onClick={() => editCategory(category)}>Edit</Button>
                      <Button type="button" variant="destructive" onClick={() => deleteCategoryMutation.mutate(category.id)}>Delete</Button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}

          {activePanel === "uploads" ? (
            <div className="grid gap-6 xl:grid-cols-2">
              <SectionCard title="Package images" description="Upload hero or gallery images for an existing package.">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Package</Label>
                    <Combobox
                      options={packagesQuery.data?.map((travelPackage) => ({
                        value: travelPackage.id,
                        label: travelPackage.title,
                      })) ?? []}
                      value={uploadPackageId}
                      onValueChange={setUploadPackageId}
                      placeholder="Select package"
                      searchPlaceholder="Search packages..."
                      emptyText="No packages found."
                    />
                  </div>
                  {uploadPackage ? (
                    <ImageUploadField targetType="package" targetId={uploadPackage.id} title="Upload package image" isHero onUploaded={async () => { toast.success("Package image uploaded."); await queryClient.invalidateQueries({ queryKey: ["admin", "packages"] }); }} />
                  ) : (
                    <p className="rounded-md border border-[#D7C6A5] bg-white px-4 py-3 text-sm text-[#6A5A47]">Select a package to upload its images.</p>
                  )}
                </div>
              </SectionCard>

              <SectionCard title="Destination images" description="Upload hero or gallery images for an existing destination.">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Destination</Label>
                    <Combobox
                      options={destinationsQuery.data?.map((destination) => ({
                        value: destination.id,
                        label: destination.title,
                      })) ?? []}
                      value={uploadDestinationId}
                      onValueChange={setUploadDestinationId}
                      placeholder="Select destination"
                      searchPlaceholder="Search destinations..."
                      emptyText="No destinations found."
                    />
                  </div>
                  {uploadDestination ? (
                    <ImageUploadField targetType="destination" targetId={uploadDestination.id} title="Upload destination image" isHero={false} sortOrder={1} onUploaded={async () => { toast.success("Destination image uploaded."); await queryClient.invalidateQueries({ queryKey: ["admin", "destinations"] }); }} />
                  ) : (
                    <p className="rounded-md border border-[#D7C6A5] bg-white px-4 py-3 text-sm text-[#6A5A47]">Select a destination to upload its images.</p>
                  )}
                </div>
              </SectionCard>
            </div>
          ) : null}

          {activePanel === "inquiries" ? (
            <SectionCard title="Inquiries" description="Incoming leads and contact requests.">
              <div className="grid gap-3">
                {inquiriesQuery.data?.length ? inquiriesQuery.data.map((inquiry) => (
                  <div key={inquiry.id} className="grid gap-2 rounded-2xl border border-[#D7C6A5] bg-white px-4 py-3 md:grid-cols-[1fr_auto]">
                    <div>
                      <p className="font-medium text-[#1A1714]">{inquiry.fullName}</p>
                      <p className="text-sm text-[#6A5A47]">{inquiry.email} · {inquiry.phone}</p>
                      <p className="mt-1 text-sm text-[#4A3E31]">{inquiry.selectedService} · {inquiry.budgetRange}</p>
                    </div>
                    <p className="text-sm text-[#6A5A47]">{formatDate(inquiry.createdAt)}</p>
                  </div>
                )) : <div className="rounded-2xl border border-[#D7C6A5] bg-white px-4 py-3 text-sm text-[#6A5A47]">No inquiries yet.</div>}
              </div>
            </SectionCard>
          ) : null}

          {activePanel === "users" ? (
            <SectionCard title="Users" description="User management API is not connected yet.">
              <p className="text-sm text-[#6A5A47]">This workspace currently has auth and role resolution, but no backend endpoint for listing or editing users. Keep this tab disabled until the server exposes it.</p>
            </SectionCard>
          ) : null}

          <Dialog open={isQuickDestinationOpen} onOpenChange={setIsQuickDestinationOpen}>
            <DialogContent className="max-h-[90vh] overflow-y-auto border-[#D7C6A5] bg-[#FBF7F1] text-[#1A1714] sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-serif text-3xl">Create Destination</DialogTitle>
                <DialogDescription className="text-sm text-[#6A5A47]">
                  Add a destination directly from the package form. It will be selected automatically after creation.
                </DialogDescription>
              </DialogHeader>

              <form
                className="grid gap-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  createDestinationMutation.mutate(destinationForm as never);
                }}
              >
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Combobox
                    options={categoriesQuery.data?.map((category) => ({
                      value: category.id,
                      label: category.title,
                    })) ?? []}
                    value={destinationForm.categoryId}
                    onValueChange={(value) => setDestinationForm((current) => ({ ...current, categoryId: value }))}
                    placeholder="No category"
                    searchPlaceholder="Search categories..."
                    emptyText="No categories found."
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Name</Label>
                  <Input value={destinationForm.title} onChange={(event) => setDestinationForm((current) => ({ ...current, title: event.target.value }))} className="bg-white text-[#1A1714] caret-[#1A1714]" required />
                </div>

                <div className="grid gap-2">
                  <Label>State</Label>
                  <Input value={destinationForm.state} onChange={(event) => setDestinationForm((current) => ({ ...current, state: event.target.value }))} className="bg-white text-[#1A1714] caret-[#1A1714]" />
                </div>

                <div className="grid gap-2">
                  <Label>Description</Label>
                  <Textarea value={destinationForm.shortDescription} onChange={(event) => setDestinationForm((current) => ({ ...current, shortDescription: event.target.value, description: event.target.value }))} className="min-h-24 bg-white text-[#1A1714] caret-[#1A1714]" required />
                </div>

                <div className="grid gap-2">
                  <Label>Hero image</Label>
                  {destinationForm.heroImageUrl ? (
                    <div className="relative group overflow-hidden rounded-xl border border-[#D7C6A5]">
                      <img src={destinationForm.heroImageUrl} alt="Hero preview" className="h-44 w-full object-cover transition duration-300 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition gap-2">
                        <Button type="button" variant="destructive" size="sm" onClick={() => setDestinationForm((current) => ({ ...current, heroImageUrl: "" }))}>
                          Remove Image
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <ImageUploadField
                      targetType="generic"
                      title="Upload destination hero image"
                      targetId="destinations"
                      onUploaded={(publicUrl) => setDestinationForm((current) => ({ ...current, heroImageUrl: publicUrl }))}
                    />
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>Best season</Label>
                    <Input value={destinationForm.bestSeason} onChange={(event) => setDestinationForm((current) => ({ ...current, bestSeason: event.target.value }))} className="bg-white text-[#1A1714] caret-[#1A1714]" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Tags</Label>
                    <Input value={destinationForm.tags} onChange={(event) => setDestinationForm((current) => ({ ...current, tags: event.target.value }))} className="bg-white text-[#1A1714] caret-[#1A1714]" placeholder="Mountains, treks, snow" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button type="submit" disabled={createDestinationMutation.isPending} className="bg-[#1A1714] text-[#F7F0E6] hover:bg-[#2B2520]">
                    {createDestinationMutation.isPending ? "Creating..." : "Create and select"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsQuickDestinationOpen(false)} className="border-[#D7C6A5] bg-white">
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </section>
      </div>
    </main>
  );
}
