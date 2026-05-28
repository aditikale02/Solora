export * from "./generated/api";
export * from "./generated/api.schemas";
export { customFetch, setBaseUrl, setAuthTokenGetter } from "./custom-fetch";
export type { AuthTokenGetter } from "./custom-fetch";

import { customFetch as apiFetch } from "./custom-fetch";
import {
	contactSubmissionInputSchema,
	contactSubmissionResponseSchema,
	leadInquiryInputSchema,
	leadInquiryResponseSchema,
	newsletterSubscriptionInputSchema,
	newsletterSubscriptionResponseSchema,
	destinationCategoryInputSchema,
	destinationCategorySchema,
	adminLeadSchema,
	adminDestinationUploadResponseSchema,
	adminUploadResponseSchema,
	sessionRoleSchema,
	destinationImageSchema,
	savedDestinationSchema,
	savedPackageSchema,
	savedPackageEntrySchema,
	recentlyViewedDestinationSchema,
	destinationInputSchema,
	destinationSchema,
	packageImageSchema,
	packageInputSchema,
	packageSchema,
	packageUpdateSchema,
	serviceSchema,
	type AdminLeadRecord,
	type AdminDestinationUploadResponse,
	type AdminUploadResponse,
	type DestinationCategoryInput,
	type DestinationCategoryRecord,
	type SessionRole,
	type DestinationImageRecord,
	type SavedDestinationRecord,
	type SavedPackageRecord,
	type SavedPackageEntryRecord,
	type RecentlyViewedDestinationRecord,
	type ContactSubmissionInput,
	type ContactSubmissionResponse,
	type DestinationInput,
	type DestinationRecord,
	type LeadInquiryInput,
	type LeadInquiryResponse,
	type NewsletterSubscriptionInput,
	type NewsletterSubscriptionResponse,
	type PackageImageRecord,
	type PackageInput,
	type PackageRecord,
	type PackageUpdate,
	type ServiceRecord,
} from "@workspace/api-zod";

	const REQUEST_TIMEOUT_MS = 15000;

type LegacyDestinationInput = Partial<DestinationInput> & {
	name?: string;
	title?: string;
	description?: string;
	shortDescription?: string;
	categoryId?: string | null;
};

async function postJson<T>(path: string, body: unknown): Promise<T> {
	return apiFetch<T>(path, {
		method: "POST",
		headers: {
			"content-type": "application/json",
		},
		body: JSON.stringify(body),
		responseType: "json",
			timeoutMs: REQUEST_TIMEOUT_MS,
	});
}

export async function fetchServices(): Promise<ServiceRecord[]> {
	const response = await apiFetch<{ services: ServiceRecord[] }>("/api/services", {
		responseType: "json",
			timeoutMs: REQUEST_TIMEOUT_MS,
	});

	return response.services.map((service) => serviceSchema.parse(service));
}

export async function fetchPublicPackages(): Promise<PackageRecord[]> {
	const response = await apiFetch<{ packages: PackageRecord[] }>("/api/packages", {
		responseType: "json",
		timeoutMs: REQUEST_TIMEOUT_MS,
	});

	return response.packages.map((travelPackage) => packageSchema.parse(travelPackage));
}

export async function fetchPublicPackageBySlug(
	slug: string,
): Promise<{ package: PackageRecord; images: PackageImageRecord[] }> {
	const response = await apiFetch<{ package: PackageRecord; images: PackageImageRecord[] }>(
		`/api/packages/${slug}`,
		{
			responseType: "json",
			timeoutMs: REQUEST_TIMEOUT_MS,
		},
	);

	return {
		package: packageSchema.parse(response.package),
		images: response.images.map((image) => packageImageSchema.parse(image)),
	};
}

export async function submitLeadInquiry(
	payload: LeadInquiryInput,
): Promise<LeadInquiryResponse> {
	const body = leadInquiryInputSchema.parse(payload);
	const response = await postJson<LeadInquiryResponse>("/api/inquiries", body);

	return leadInquiryResponseSchema.parse(response);
}

export async function submitContactSubmission(
	payload: ContactSubmissionInput,
): Promise<ContactSubmissionResponse> {
	const body = contactSubmissionInputSchema.parse(payload);
	const response = await postJson<ContactSubmissionResponse>(
		"/api/contact-submissions",
		body,
	);

	return contactSubmissionResponseSchema.parse(response);
}

export async function subscribeNewsletter(
	payload: NewsletterSubscriptionInput,
): Promise<NewsletterSubscriptionResponse> {
	const body = newsletterSubscriptionInputSchema.parse(payload);
	const response = await postJson<NewsletterSubscriptionResponse>(
		"/api/newsletter",
		body,
	);

	return newsletterSubscriptionResponseSchema.parse(response);
}

export async function fetchAdminDestinations(): Promise<DestinationRecord[]> {
	const response = await apiFetch<{ destinations: DestinationRecord[] }>(
		"/api/admin/destinations",
		{
			responseType: "json",
			timeoutMs: REQUEST_TIMEOUT_MS,
		},
	);

	return response.destinations.map((destination) =>
		destinationSchema.parse(destination),
	);
}

export async function fetchAdminCategories(): Promise<DestinationCategoryRecord[]> {
	const response = await apiFetch<{ categories: DestinationCategoryRecord[] }>("/api/admin/categories", {
		responseType: "json",
		timeoutMs: REQUEST_TIMEOUT_MS,
	});

	return response.categories.map((category) => destinationCategorySchema.parse(category));
}

export async function createAdminCategory(payload: DestinationCategoryInput): Promise<DestinationCategoryRecord> {
	const body = destinationCategoryInputSchema.parse(payload);
	const response = await postJson<{ category: DestinationCategoryRecord }>("/api/admin/categories", body);

	return destinationCategorySchema.parse(response.category);
}

export async function updateAdminCategory(
	id: string,
	payload: DestinationCategoryInput,
): Promise<DestinationCategoryRecord> {
	const body = destinationCategoryInputSchema.parse(payload);
	const response = await apiFetch<{ category: DestinationCategoryRecord }>(`/api/admin/categories/${id}`, {
		method: "PUT",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(body),
		responseType: "json",
		timeoutMs: REQUEST_TIMEOUT_MS,
	});

	return destinationCategorySchema.parse(response.category);
}

export async function deleteAdminCategory(id: string): Promise<void> {
	await apiFetch(`/api/admin/categories/${id}`, {
		method: "DELETE",
		timeoutMs: REQUEST_TIMEOUT_MS,
	});
}

export async function fetchSessionRole(): Promise<SessionRole> {
	const response = await apiFetch<SessionRole>("/api/auth/role", {
		responseType: "json",
		timeoutMs: REQUEST_TIMEOUT_MS,
	});

	return sessionRoleSchema.parse(response);
}

export async function registerUser(payload: {
	email: string;
	password: string;
	fullName: string;
}): Promise<{ user: { id: string; email: string | null } }> {
	const response = await postJson<{ user: { id: string; email: string | null } }>("/api/auth/register", payload);

	return response;
}

export async function fetchPublicDestinations(): Promise<DestinationRecord[]> {
	const response = await apiFetch<{ destinations: DestinationRecord[] }>("/api/destinations", {
		responseType: "json",
		timeoutMs: REQUEST_TIMEOUT_MS,
	});

	return response.destinations.map((destination) => destinationSchema.parse(destination));
}

export async function fetchPublicDestinationBySlug(
	slug: string,
): Promise<{ destination: DestinationRecord; images: DestinationImageRecord[] }> {
	const response = await apiFetch<{ destination: DestinationRecord; images: DestinationImageRecord[] }>(
		`/api/destinations/${slug}`,
		{
			responseType: "json",
			timeoutMs: REQUEST_TIMEOUT_MS,
		},
	);

	return {
		destination: destinationSchema.parse(response.destination),
		images: response.images.map((image) => destinationImageSchema.parse(image)),
	};
}

export async function fetchDestinationCategories(): Promise<DestinationCategoryRecord[]> {
	const response = await apiFetch<{ categories: DestinationCategoryRecord[] }>("/api/categories", {
		responseType: "json",
		timeoutMs: REQUEST_TIMEOUT_MS,
	});

	return response.categories.map((category) => destinationCategorySchema.parse(category));
}

export async function fetchCategoryBySlug(
	slug: string,
): Promise<{ category: DestinationCategoryRecord; destinations: DestinationRecord[] }> {
	const response = await apiFetch<{
		category: DestinationCategoryRecord;
		destinations: DestinationRecord[];
	}>(`/api/categories/${slug}`, {
		responseType: "json",
		timeoutMs: REQUEST_TIMEOUT_MS,
	});

	return {
		category: destinationCategorySchema.parse(response.category),
		destinations: response.destinations.map((destination) => destinationSchema.parse(destination)),
	};
}

export async function saveDestination(destinationId: string): Promise<SavedDestinationRecord> {
	const response = await postJson<{ savedDestination: SavedDestinationRecord }>(
		"/api/user/saved-destinations",
		{ destinationId },
	);

	return savedDestinationSchema.parse(response.savedDestination);
}

export async function unsaveDestination(destinationId: string): Promise<void> {
	await apiFetch(`/api/user/saved-destinations/${destinationId}`, {
		method: "DELETE",
		timeoutMs: REQUEST_TIMEOUT_MS,
	});
}

export async function fetchSavedDestinations(): Promise<Array<{ save: SavedDestinationRecord; destination: DestinationRecord }>> {
	const response = await apiFetch<{ savedDestinations: Array<{ save: SavedDestinationRecord; destination: DestinationRecord }> }>(
		"/api/user/saved-destinations",
		{ responseType: "json", timeoutMs: REQUEST_TIMEOUT_MS },
	);

	return response.savedDestinations.map((item) => ({
		save: savedDestinationSchema.parse(item.save),
		destination: destinationSchema.parse(item.destination),
	}));
}

export async function fetchSavedPackages(): Promise<Array<SavedPackageEntryRecord>> {
	const response = await apiFetch<{ savedPackages: SavedPackageEntryRecord[] }>(
		"/api/user/saved-packages",
		{ responseType: "json", timeoutMs: REQUEST_TIMEOUT_MS },
	);

	return response.savedPackages.map((item) => savedPackageEntrySchema.parse(item));
}

export async function fetchRecentlyViewedDestinations(): Promise<Array<{ view: RecentlyViewedDestinationRecord; destination: DestinationRecord }>> {
	const response = await apiFetch<{ recentlyViewed: Array<{ view: RecentlyViewedDestinationRecord; destination: DestinationRecord }> }>(
		"/api/user/recently-viewed",
		{ responseType: "json", timeoutMs: REQUEST_TIMEOUT_MS },
	);

	return response.recentlyViewed.map((item) => ({
		view: recentlyViewedDestinationSchema.parse(item.view),
		destination: destinationSchema.parse(item.destination),
	}));
}

export async function recordRecentlyViewed(destinationId: string): Promise<void> {
	await postJson("/api/user/recently-viewed", { destinationId });
}

export async function savePackage(packageId: string): Promise<SavedPackageRecord> {
	const response = await postJson<{ savedPackage: SavedPackageRecord }>("/api/user/saved-packages", {
		packageId,
	});

	return savedPackageSchema.parse(response.savedPackage);
}

export async function unsavePackage(packageId: string): Promise<void> {
	await apiFetch(`/api/user/saved-packages/${packageId}`, {
		method: "DELETE",
		timeoutMs: REQUEST_TIMEOUT_MS,
	});
}

export async function createAdminDestination(
	payload: LegacyDestinationInput,
): Promise<DestinationRecord> {
	const body = destinationInputSchema.parse({
		...payload,
		title: payload.title ?? payload.name ?? "",
		name: payload.name ?? payload.title ?? "",
		description: payload.description ?? payload.shortDescription ?? "",
		shortDescription: payload.shortDescription ?? payload.description ?? "",
	});
	const response = await postJson<{ destination: DestinationRecord }>(
		"/api/admin/destinations",
		body,
	);

	return destinationSchema.parse(response.destination);
}

export async function updateAdminDestination(
	id: string,
	payload: LegacyDestinationInput,
): Promise<DestinationRecord> {
	const body = destinationInputSchema.parse({
		...payload,
		title: payload.title ?? payload.name ?? "",
		name: payload.name ?? payload.title ?? "",
		description: payload.description ?? payload.shortDescription ?? "",
		shortDescription: payload.shortDescription ?? payload.description ?? "",
	});
	const response = await apiFetch<{ destination: DestinationRecord }>(
		`/api/admin/destinations/${id}`,
		{
			method: "PUT",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(body),
			responseType: "json",
			timeoutMs: REQUEST_TIMEOUT_MS,
		},
	);

	return destinationSchema.parse(response.destination);
}

export async function deleteAdminDestination(id: string): Promise<void> {
	await apiFetch(`/api/admin/destinations/${id}`, {
		method: "DELETE",
		timeoutMs: REQUEST_TIMEOUT_MS,
	});
}

export async function fetchAdminPackages(): Promise<PackageRecord[]> {
	const response = await apiFetch<{ packages: PackageRecord[] }>(
		"/api/admin/packages",
		{
			responseType: "json",
			timeoutMs: REQUEST_TIMEOUT_MS,
		},
	);

	return response.packages.map((travelPackage) =>
		packageSchema.parse(travelPackage),
	);
}

export async function createAdminPackage(
	payload: PackageInput,
): Promise<PackageRecord> {
	const body = packageInputSchema.parse(payload);
	const response = await postJson<{ package: PackageRecord }>(
		"/api/admin/packages",
		body,
	);

	return packageSchema.parse(response.package);
}

export async function updateAdminPackage(
	id: string,
	payload: PackageUpdate,
): Promise<PackageRecord> {
	const body = packageUpdateSchema.parse(payload);
	const response = await apiFetch<{ package: PackageRecord }>(
		`/api/admin/packages/${id}`,
		{
			method: "PATCH",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify(body),
			responseType: "json",
			timeoutMs: REQUEST_TIMEOUT_MS,
		},
	);

	return packageSchema.parse(response.package);
}

export async function deleteAdminPackage(id: string): Promise<void> {
	await apiFetch(`/api/admin/packages/${id}`, {
		method: "DELETE",
		timeoutMs: REQUEST_TIMEOUT_MS,
	});
}

export async function fetchAdminInquiries(): Promise<AdminLeadRecord[]> {
	const response = await apiFetch<{ inquiries: AdminLeadRecord[] }>(
		"/api/admin/inquiries",
		{
			responseType: "json",
			timeoutMs: REQUEST_TIMEOUT_MS,
		},
	);

	return response.inquiries.map((inquiry) => adminLeadSchema.parse(inquiry));
}

export async function uploadAdminPackageImage(payload: {
	packageId: string;
	fileName: string;
	contentType: string;
	base64: string;
	altText?: string;
	sortOrder?: number;
	isHero?: boolean;
}): Promise<AdminUploadResponse> {
	const response = await postJson<AdminUploadResponse>("/api/admin/uploads", {
		altText: "",
		sortOrder: 0,
		isHero: true,
		...payload,
	});

	return adminUploadResponseSchema.parse(response);
}

export async function uploadAdminGenericImage(payload: {
	fileName: string;
	contentType: string;
	base64: string;
	folder?: string;
}): Promise<{ upload: { bucket: string; path: string; publicUrl: string } }> {
	const response = await postJson<{ upload: { bucket: string; path: string; publicUrl: string } }>(
		"/api/admin/uploads/generic",
		{
			folder: "admin-uploads",
			...payload,
		},
	);

	return response;
}

export async function uploadAdminDestinationImage(payload: {
	destinationId: string;
	fileName: string;
	contentType: string;
	base64: string;
	altText?: string;
	sortOrder?: number;
	isHero?: boolean;
}): Promise<AdminDestinationUploadResponse> {
	const response = await postJson<AdminDestinationUploadResponse>("/api/admin/destination-images", {
		altText: "",
		sortOrder: 0,
		isHero: true,
		...payload,
	});

	return adminDestinationUploadResponseSchema.parse(response);
}
