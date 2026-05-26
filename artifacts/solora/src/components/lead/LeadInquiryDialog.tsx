import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  fetchServices,
  submitContactSubmission,
  submitLeadInquiry,
} from "@workspace/api-client-react";
import {
  contactSubmissionInputSchema,
  leadInquiryInputSchema,
  type LeadSource,
  type ServiceRecord,
} from "@workspace/api-zod";

export type InquiryMode = "lead" | "contact";

const fallbackServices: ServiceRecord[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    title: "Solo Consultation",
    slug: "solo-consultation",
    description: "A guided planning session to shape your ideal solo travel journey.",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    title: "Custom Journey Design",
    slug: "custom-journey-design",
    description: "End-to-end itinerary design tailored to pace, purpose, and preferences.",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    title: "Healing Retreat Planning",
    slug: "healing-retreat-planning",
    description: "Intentional quiet time, reflection, and restorative travel experiences.",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    title: "Adventure Escapes",
    slug: "adventure-escapes",
    description: "High-energy solo trips for explorers who want movement and momentum.",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

function getLeadCopy(source: LeadSource) {
  switch (source) {
    case "navbar_cta":
      return "A fast starting point for planning your next solo escape.";
    case "final_cta_primary":
    case "final_cta_secondary":
      return "Tell us what kind of journey you want and we’ll respond with next steps.";
    case "hero_cta":
      return "Use this form to begin a tailored solo travel plan.";
    default:
      return "Share a few details and we’ll get back to you shortly.";
  }
}

function getContactCopy() {
  return "Use this form for general questions, partnership ideas, or direct contact.";
}

type LeadFormValues = {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  website: string;
  selectedServiceSlug: string;
  budgetRange: string;
  message: string;
  source: LeadSource;
};

type ContactFormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string;
  source: LeadSource;
};

type LeadInquiryDialogProps = {
  open: boolean;
  mode: InquiryMode;
  source: LeadSource;
  serviceSlug?: string;
  subject?: string;
  onOpenChange: (open: boolean) => void;
};

const budgetOptions = [
  "Under $1,000",
  "$1,000 - $2,500",
  "$2,500 - $5,000",
  "$5,000 - $10,000",
  "$10,000+",
];

export default function LeadInquiryDialog({
  open,
  mode,
  source,
  serviceSlug,
  subject,
  onOpenChange,
}: LeadInquiryDialogProps) {
  const servicesQuery = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
    staleTime: 1000 * 60 * 10,
  });

  const services = servicesQuery.data?.length ? servicesQuery.data : fallbackServices;

  const leadDefaultService = useMemo(() => {
    return services.find((service) => service.slug === serviceSlug)?.slug ?? services[0]?.slug ?? "solo-consultation";
  }, [serviceSlug, services]);

  const leadForm = useForm<LeadFormValues>({
    resolver: zodResolver(leadInquiryInputSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      companyName: "",
      website: "",
      selectedServiceSlug: leadDefaultService,
      budgetRange: "",
      message: "",
      source,
    },
  });

  const contactForm = useForm<ContactFormValues>({
    resolver: zodResolver(contactSubmissionInputSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: subject ?? "General inquiry",
      message: "",
      website: "",
      source,
    },
  });

  useEffect(() => {
    if (!open) return;

    if (mode === "lead") {
      leadForm.reset({
        fullName: "",
        email: "",
        phone: "",
        companyName: "",
        website: "",
        selectedServiceSlug: leadDefaultService,
        budgetRange: "",
        message: "",
        source,
      });
    }

    if (mode === "contact") {
      contactForm.reset({
        name: "",
        email: "",
        subject: subject ?? "General inquiry",
        message: "",
        website: "",
        source,
      });
    }
  }, [contactForm, leadDefaultService, leadForm, mode, open, source, subject]);

  const leadMutation = useMutation({
    mutationFn: submitLeadInquiry,
  });

  const contactMutation = useMutation({
    mutationFn: submitContactSubmission,
  });

  const title = mode === "lead" ? "Plan Your Solo Journey" : "Contact Solora";
  const description = mode === "lead" ? getLeadCopy(source) : getContactCopy();
  const isSubmitting = leadMutation.isPending || contactMutation.isPending;

  const handleLeadSubmit = leadForm.handleSubmit(async (values) => {
    await toast.promise(leadMutation.mutateAsync(values), {
      loading: "Submitting your inquiry...",
      success: "Inquiry received. We’ll be in touch soon.",
      error: (error) =>
        error instanceof Error ? error.message : "Could not submit inquiry.",
    });

    leadForm.reset({
      fullName: "",
      email: "",
      phone: "",
      companyName: "",
      website: "",
      selectedServiceSlug: leadDefaultService,
      budgetRange: "",
      message: "",
      source,
    });
    onOpenChange(false);
  });

  const handleContactSubmit = contactForm.handleSubmit(async (values) => {
    await toast.promise(contactMutation.mutateAsync(values), {
      loading: "Sending your message...",
      success: "Thanks for reaching out. We’ll reply soon.",
      error: (error) =>
        error instanceof Error ? error.message : "Could not send your message.",
    });

    contactForm.reset({
      name: "",
      email: "",
      subject: subject ?? "General inquiry",
      message: "",
      website: "",
      source,
    });
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-2xl max-h-[92vh] overflow-y-auto bg-[#F7F2EC] border-[#D7C6A5] p-4 sm:p-6">
        <DialogHeader className="text-left">
          <Badge className="w-fit bg-[#C9A96E]/15 text-[#8B6340] border border-[#C9A96E]/25 hover:bg-[#C9A96E]/15">
            {mode === "lead" ? "New Inquiry" : "Direct Contact"}
          </Badge>
          <DialogTitle className="font-serif text-3xl text-[#1A1714]">
            {title}
          </DialogTitle>
          <DialogDescription className="text-[#1A1714]/70 text-sm leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>

        {mode === "lead" ? (
          <Form {...leadForm}>
            <form className="grid gap-4" onSubmit={handleLeadSubmit}>
              <FormField
                control={leadForm.control}
                name="website"
                render={({ field }) => (
                  <FormItem className="sr-only">
                    <FormControl>
                      <Input {...field} autoComplete="off" tabIndex={-1} aria-hidden="true" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={leadForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Your full name" className="bg-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={leadForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="you@example.com" className="bg-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={leadForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Phone number" className="bg-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={leadForm.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Company or organization" className="bg-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={leadForm.control}
                  name="selectedServiceSlug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Choose a service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service.id} value={service.slug}>
                              {service.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={leadForm.control}
                  name="budgetRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget range</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select a budget" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {budgetOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={leadForm.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Tell us about the trip or outcome you want." className="min-h-[140px] bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSubmitting} className="w-full bg-[#1A1714] text-[#F7F0E6] hover:bg-[#241F1B]">
                {isSubmitting ? "Submitting..." : "Send Inquiry"}
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...contactForm}>
            <form className="grid gap-4" onSubmit={handleContactSubmit}>
              <FormField
                control={contactForm.control}
                name="website"
                render={({ field }) => (
                  <FormItem className="sr-only">
                    <FormControl>
                      <Input {...field} autoComplete="off" tabIndex={-1} aria-hidden="true" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={contactForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Your name" className="bg-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={contactForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="you@example.com" className="bg-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={contactForm.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="What can we help with?" className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={contactForm.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Share the details." className="min-h-[160px] bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSubmitting} className="w-full bg-[#1A1714] text-[#F7F0E6] hover:bg-[#241F1B]">
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
