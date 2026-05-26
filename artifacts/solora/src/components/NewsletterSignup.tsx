import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  newsletterSubscriptionInputSchema,
  type NewsletterSubscriptionInput,
} from "@workspace/api-zod";
import { subscribeNewsletter } from "@workspace/api-client-react";

export default function NewsletterSignup() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NewsletterSubscriptionInput>({
    resolver: zodResolver(newsletterSubscriptionInputSchema),
    defaultValues: {
      email: "",
      website: "",
      source: "newsletter",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);

    try {
      await toast.promise(subscribeNewsletter(values), {
        loading: "Subscribing you to Solora updates...",
        success: "You’re on the list.",
        error: (error) =>
          error instanceof Error
            ? error.message
            : "Could not subscribe right now.",
      });

      form.reset({ email: "", website: "", source: "newsletter" });
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="relative border-b border-[#F7F0E6]/20 focus-within:border-[#C9A96E] transition-colors duration-300">
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem className="sr-only">
              <FormControl>
                <Input {...field} autoComplete="off" tabIndex={-1} aria-hidden="true" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="your email"
                  autoComplete="email"
                  className="w-full bg-transparent border-none px-0 py-2 pr-8 outline-none font-sans text-sm placeholder:text-[#F7F0E6]/25 text-[#F7F0E6]/80 shadow-none focus-visible:ring-0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant="ghost"
          disabled={isSubmitting}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-[#C9A96E] hover:text-[#F7F0E6] transition-colors duration-300 cursor-none font-sans text-sm bg-transparent hover:bg-transparent px-0"
        >
          {isSubmitting ? "…" : "→"}
        </Button>
      </form>
    </Form>
  );
}
