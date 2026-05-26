import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImageIcon, Inbox, LogOut, MapPin, PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createAdminDestination,
  createAdminPackage,
  deleteAdminPackage,
  updateAdminDestination,
  deleteAdminDestination,
  fetchAdminDestinations,
  fetchAdminInquiries,
  fetchAdminPackages,
  updateAdminPackage,
} from "@workspace/api-client-react";
import type { DestinationRecord, PackageRecord } from "@workspace/api-zod";
import { toast } from "sonner";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { signOutAdmin } from "@/lib/admin-auth";
import { useAdminSession } from "@/hooks/use-admin-session";

type ActivePanel = "packages" | "inquiries" | "images";

const emptyPackageForm = {
  destinationId: "",
  title: "",
  description: "",
  durationDays: "5",
  priceAmount: "0",
  priceCurrency: "INR",
  heroImageUrl: "",
  isActive: true,
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const session = useAdminSession();
  const queryClient = useQueryClient();
  const [activePanel, setActivePanel] = useState<ActivePanel>("packages");
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [packageForm, setPackageForm] = useState(emptyPackageForm);
  const [destinationName, setDestinationName] = useState("");
  const [editingDestinationId, setEditingDestinationId] = useState<string | null>(null);
  const [editingDestinationDesc, setEditingDestinationDesc] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

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

  const selectedPackage = useMemo(() => {
    return packagesQuery.data?.find((travelPackage) => travelPackage.id === editingPackageId);
  }, [editingPackageId, packagesQuery.data]);

  const createDestinationMutation = useMutation({
    mutationFn: createAdminDestination,
    onSuccess: async (destination) => {
      setDestinationName("");
      setEditingDestinationDesc("");
      setPackageForm((current) => ({ ...current, destinationId: destination.id }));
      toast.success("Destination created.");
      await queryClient.invalidateQueries({ queryKey: ["admin", "destinations"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Could not create destination.");
    },
  });

  const updateDestinationMutation = useMutation({
    mutationFn: async ({ id, name, description }: { id: string; name: string; description: string }) =>
      updateAdminDestination(id, { name, description }),
    onMutate: async ({ id, name, description }) => {
      await queryClient.cancelQueries({ queryKey: ["admin", "destinations"] });
      const previous = queryClient.getQueryData<DestinationRecord[]>(["admin", "destinations"]);

      queryClient.setQueryData<DestinationRecord[]>(["admin", "destinations"], (current = []) =>
        current.map((item) =>
          item.id === id
            ? { ...item, name, description, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""), updatedAt: new Date() }
            : item,
        ),
      );

      return { previous };
    },
    onSuccess: async (destination) => {
      setEditingDestinationId(null);
      setDestinationName("");
      setEditingDestinationDesc("");
      toast.success(`Destination updated: ${destination.name}`);
      await queryClient.invalidateQueries({ queryKey: ["admin", "destinations"] });
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["admin", "destinations"], context.previous);
      }
      toast.error(error instanceof Error ? error.message : "Could not update destination.");
    },
  });

  const deleteDestinationMutation = useMutation({
    mutationFn: deleteAdminDestination,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["admin", "destinations"] });
      const previous = queryClient.getQueryData<DestinationRecord[]>(["admin", "destinations"]);

      queryClient.setQueryData<DestinationRecord[]>(["admin", "destinations"], (current = []) =>
        current.filter((item) => item.id !== id),
      );

      return { previous };
    },
    onSuccess: async () => {
      setStatusMessage("Destination deleted.");
      toast.success("Destination deleted.");
      await queryClient.invalidateQueries({ queryKey: ["admin", "destinations"] });
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["admin", "destinations"], context.previous);
      }
      toast.error(error instanceof Error ? error.message : "Could not delete destination.");
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
        heroImageUrl: packageForm.heroImageUrl,
        isActive: packageForm.isActive,
      };

      if (editingPackageId) {
        return updateAdminPackage(editingPackageId, payload);
      }

      return createAdminPackage(payload);
    },
    onSuccess: async () => {
      setPackageForm(emptyPackageForm);
      setEditingPackageId(null);
      setStatusMessage("Package saved.");
      await queryClient.invalidateQueries({ queryKey: ["admin", "packages"] });
    },
  });

  const deletePackageMutation = useMutation({
    mutationFn: deleteAdminPackage,
    onSuccess: async () => {
      setStatusMessage("Package deleted.");
      await queryClient.invalidateQueries({ queryKey: ["admin", "packages"] });
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
      heroImageUrl: travelPackage.heroImageUrl,
      isActive: travelPackage.isActive,
    });
    setActivePanel("packages");
  }

  const navItems = [
    { id: "packages" as const, label: "Packages", icon: PackagePlus },
    { id: "inquiries" as const, label: "Inquiries", icon: Inbox },
    { id: "images" as const, label: "Images", icon: ImageIcon },
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
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActivePanel(item.id)}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition ${
                  activePanel === item.id
                    ? "bg-[#C9A96E] text-[#1A1714]"
                    : "text-[#F7F0E6]/75 hover:bg-white/10"
                }`}
              >
                <item.icon className="size-4" />
                {item.label}
              </button>
            ))}
          </nav>
          <Button
            type="button"
            onClick={handleLogout}
            className="mt-8 w-full bg-[#F7F0E6] text-[#1A1714] hover:bg-white"
          >
            <LogOut className="mr-2 size-4" />
            Logout
          </Button>
        </aside>

        <section className="p-5 lg:p-8">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.18em] text-[#8B6340]">Operations</p>
            <h1 className="mt-2 font-serif text-4xl">Admin Dashboard</h1>
          </div>

          {statusMessage ? (
            <p className="mb-5 rounded-md border border-[#D7C6A5] bg-white px-4 py-3 text-sm">
              {statusMessage}
            </p>
          ) : null}

          {activePanel === "packages" ? (
            <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
              <div className="rounded-md border border-[#D7C6A5] bg-white/75 p-5">
                <h2 className="font-serif text-2xl">{editingPackageId ? "Edit Package" : "Create Package"}</h2>
                <form
                  className="mt-5 grid gap-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    savePackageMutation.mutate();
                  }}
                >
                  <div className="grid gap-2">
                    <Label>Destination</Label>
                    <select
                      value={packageForm.destinationId}
                      onChange={(event) =>
                        setPackageForm((current) => ({ ...current, destinationId: event.target.value }))
                      }
                      className="h-10 rounded-md border border-[#D7C6A5] bg-white px-3"
                      required
                    >
                      <option value="">Select destination</option>
                      {destinationsQuery.data?.map((destination) => (
                        <option key={destination.id} value={destination.id}>
                          {destination.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <Input
                      placeholder="New destination"
                        value={destinationName}
                        onChange={(event) => setDestinationName(event.target.value)}
                      className="bg-white"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={!destinationName || createDestinationMutation.isPending || updateDestinationMutation.isPending}
                      onClick={() => {
                        if (editingDestinationId) {
                          updateDestinationMutation.mutate({ id: editingDestinationId, name: destinationName, description: editingDestinationDesc });
                        } else {
                          createDestinationMutation.mutate({ name: destinationName, description: editingDestinationDesc });
                        }
                      }}
                    >
                      {editingDestinationId ? (updateDestinationMutation.isPending ? "Saving..." : "Save") : "Add"}
                    </Button>
                  </div>
                  {/** Destination list with edit/delete */}
                  <div className="mt-4 space-y-2">
                    {destinationsQuery.data?.map((dest) => (
                      <div key={dest.id} className="flex items-center justify-between rounded-md border border-[#D7C6A5] bg-white p-2">
                        <div>
                          <div className="font-medium">{dest.name}</div>
                          <div className="text-xs text-[#1A1714]/60">{dest.description}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setEditingDestinationId(dest.id);
                              setDestinationName(dest.title ?? dest.name ?? "");
                              setEditingDestinationDesc(dest.description ?? "");
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => deleteDestinationMutation.mutate(dest.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 grid gap-2">
                    <Label>Destination description</Label>
                    <Textarea
                      value={editingDestinationDesc}
                      onChange={(e) => setEditingDestinationDesc(e.target.value)}
                      className="bg-white"
                      maxLength={2000}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Title</Label>
                    <Input
                      value={packageForm.title}
                      onChange={(event) => setPackageForm((current) => ({ ...current, title: event.target.value }))}
                      className="bg-white"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Description</Label>
                    <Textarea
                      value={packageForm.description}
                      onChange={(event) =>
                        setPackageForm((current) => ({ ...current, description: event.target.value }))
                      }
                      className="min-h-28 bg-white"
                      required
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="grid gap-2">
                      <Label>Days</Label>
                      <Input
                        type="number"
                        min="1"
                        value={packageForm.durationDays}
                        onChange={(event) =>
                          setPackageForm((current) => ({ ...current, durationDays: event.target.value }))
                        }
                        className="bg-white"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Price</Label>
                      <Input
                        type="number"
                        min="0"
                        value={packageForm.priceAmount}
                        onChange={(event) =>
                          setPackageForm((current) => ({ ...current, priceAmount: event.target.value }))
                        }
                        className="bg-white"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Currency</Label>
                      <Input
                        value={packageForm.priceCurrency}
                        onChange={(event) =>
                          setPackageForm((current) => ({ ...current, priceCurrency: event.target.value }))
                        }
                        className="bg-white"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Hero image URL</Label>
                    <Input
                      value={packageForm.heroImageUrl}
                      onChange={(event) =>
                        setPackageForm((current) => ({ ...current, heroImageUrl: event.target.value }))
                      }
                      className="bg-white"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={packageForm.isActive}
                      onChange={(event) =>
                        setPackageForm((current) => ({ ...current, isActive: event.target.checked }))
                      }
                    />
                    Active package
                  </label>
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={savePackageMutation.isPending}
                      className="bg-[#1A1714] text-[#F7F0E6] hover:bg-[#2B2520]"
                    >
                      {savePackageMutation.isPending ? "Saving..." : "Save package"}
                    </Button>
                    {editingPackageId ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingPackageId(null);
                          setPackageForm(emptyPackageForm);
                        }}
                      >
                        Cancel
                      </Button>
                    ) : null}
                  </div>
                </form>
              </div>

              <div className="grid gap-3">
                {packagesQuery.data?.map((travelPackage) => (
                  <article
                    key={travelPackage.id}
                    className="grid gap-4 rounded-md border border-[#D7C6A5] bg-white/75 p-4 md:grid-cols-[140px_1fr_auto]"
                  >
                    {travelPackage.heroImageUrl ? (
                      <img src={travelPackage.heroImageUrl} alt="" className="h-28 w-full rounded-md object-cover" />
                    ) : (
                      <div className="flex h-28 items-center justify-center rounded-md bg-[#E8DED0]">
                        <MapPin className="size-5 text-[#8B6340]" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-serif text-2xl">{travelPackage.title}</h3>
                      <p className="text-sm text-[#1A1714]/60">{travelPackage.destinationName ?? "Destination"} · {travelPackage.durationDays} days</p>
                      <p className="mt-2 line-clamp-2 text-sm">{travelPackage.description}</p>
                    </div>
                    <div className="flex gap-2 md:flex-col">
                      <Button type="button" variant="outline" onClick={() => editPackage(travelPackage)}>
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => deletePackageMutation.mutate(travelPackage.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}

          {activePanel === "inquiries" ? (
            <div className="overflow-hidden rounded-md border border-[#D7C6A5] bg-white/75">
              {inquiriesQuery.data?.map((inquiry) => (
                <div key={inquiry.id} className="grid gap-2 border-b border-[#D7C6A5] p-4 last:border-b-0 md:grid-cols-[1fr_auto]">
                  <div>
                    <p className="font-medium">{inquiry.fullName}</p>
                    <p className="text-sm text-[#1A1714]/60">{inquiry.email} · {inquiry.phone}</p>
                    <p className="mt-1 text-sm">{inquiry.selectedService} · {inquiry.budgetRange}</p>
                  </div>
                  <p className="text-sm text-[#1A1714]/60">{formatDate(inquiry.createdAt)}</p>
                </div>
              ))}
            </div>
          ) : null}

          {activePanel === "images" ? (
            <div className="max-w-xl">
              <div className="mb-4 grid gap-2">
                <Label>Package</Label>
                <select
                  value={editingPackageId ?? ""}
                  onChange={(event) => setEditingPackageId(event.target.value || null)}
                  className="h-10 rounded-md border border-[#D7C6A5] bg-white px-3"
                >
                  <option value="">Select package</option>
                  {packagesQuery.data?.map((travelPackage) => (
                    <option key={travelPackage.id} value={travelPackage.id}>
                      {travelPackage.title}
                    </option>
                  ))}
                </select>
              </div>
              {selectedPackage ? (
                <ImageUploadField
                  packageId={selectedPackage.id}
                  onUploaded={async (upload) => {
                    setStatusMessage("Image uploaded.");
                    setPackageForm((current) => ({ ...current, heroImageUrl: upload.upload.publicUrl }));
                    await queryClient.invalidateQueries({ queryKey: ["admin", "packages"] });
                  }}
                />
              ) : (
                <p className="rounded-md border border-[#D7C6A5] bg-white/75 p-4 text-sm">
                  Select a package before uploading an image.
                </p>
              )}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
