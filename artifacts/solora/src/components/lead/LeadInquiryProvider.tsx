import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import LeadInquiryDialog from "./LeadInquiryDialog";
import type { LeadSource } from "@workspace/api-zod";

export type InquiryMode = "lead" | "contact";

type InquiryOptions = {
  mode?: InquiryMode;
  source?: LeadSource;
  serviceSlug?: string;
  subject?: string;
};

type InquiryState = {
  open: boolean;
  mode: InquiryMode;
  source: LeadSource;
  serviceSlug?: string;
  subject?: string;
};

type LeadInquiryContextValue = {
  openInquiry: (options?: InquiryOptions) => void;
  closeInquiry: () => void;
  inquiryState: InquiryState;
};

const LeadInquiryContext = createContext<LeadInquiryContextValue | null>(null);

const defaultState: InquiryState = {
  open: false,
  mode: "lead",
  source: "website",
};

export function LeadInquiryProvider({ children }: { children: ReactNode }) {
  const [inquiryState, setInquiryState] = useState<InquiryState>(defaultState);

  const value = useMemo<LeadInquiryContextValue>(
    () => ({
      openInquiry: (options = {}) => {
        setInquiryState({
          open: true,
          mode: options.mode ?? "lead",
          source: options.source ?? "website",
          serviceSlug: options.serviceSlug,
          subject: options.subject,
        });
      },
      closeInquiry: () => setInquiryState((current) => ({ ...current, open: false })),
      inquiryState,
    }),
    [inquiryState],
  );

  return (
    <LeadInquiryContext.Provider value={value}>
      {children}
      <LeadInquiryDialog
        open={inquiryState.open}
        mode={inquiryState.mode}
        source={inquiryState.source}
        serviceSlug={inquiryState.serviceSlug}
        subject={inquiryState.subject}
        onOpenChange={(open) => {
          if (!open) {
            setInquiryState((current) => ({ ...current, open: false }));
          }
        }}
      />
    </LeadInquiryContext.Provider>
  );
}

export function useLeadInquiry() {
  const context = useContext(LeadInquiryContext);

  if (!context) {
    throw new Error("useLeadInquiry must be used within LeadInquiryProvider");
  }

  return context;
}
