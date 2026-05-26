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
	adminLeadSchema,
	adminUploadResponseSchema,
	destinationInputSchema,
	destinationSchema,
	packageImageSchema,
	packageInputSchema,
	packageSchema,
	packageUpdateSchema,
	serviceSchema,
	type AdminLeadRecord,
	type AdminUploadResponse,
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

export async function createAdminDestination(
	payload: DestinationInput,
): Promise<DestinationRecord> {
	const body = destinationInputSchema.parse(payload);
	const response = await postJson<{ destination: DestinationRecord }>(
		"/api/admin/destinations",
		body,
	);

	return destinationSchema.parse(response.destination);
}

export async function updateAdminDestination(
	id: string,
	payload: DestinationInput,
): Promise<DestinationRecord> {
	const body = destinationInputSchema.parse(payload);
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
