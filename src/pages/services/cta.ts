import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Call-to-action links of the service pages, styled as buttons. Text may wrap
// on small screens (long labels such as "Demander un devis gratuit …").
const base = "h-auto min-h-11 whitespace-normal py-3 text-center";

export const ctaPrimary = cn(buttonVariants({ size: "lg" }), base);
export const ctaSecondary = cn(buttonVariants({ variant: "outline", size: "lg" }), base);
