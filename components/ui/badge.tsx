import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
  {
    variants: {
      variant: {
        soft: "border-transparent",
        outline: "bg-transparent",
      },
      tone: {
        default: "",
        info: "",
        success: "",
        warning: "",
        danger: "",
        gold: "",
        teal: "",
      },
    },
    compoundVariants: [
      { tone: "default", variant: "soft", className: "bg-brand-navy/8 text-brand-navy" },
      { tone: "default", variant: "outline", className: "border-border text-brand-navy" },
      { tone: "info", variant: "soft", className: "bg-brand-blue/10 text-brand-blue" },
      { tone: "info", variant: "outline", className: "border-brand-blue/25 text-brand-blue" },
      { tone: "success", variant: "soft", className: "bg-success/12 text-success" },
      { tone: "success", variant: "outline", className: "border-success/25 text-success" },
      { tone: "warning", variant: "soft", className: "bg-warning/12 text-warning" },
      { tone: "warning", variant: "outline", className: "border-warning/25 text-warning" },
      { tone: "danger", variant: "soft", className: "bg-danger/12 text-danger" },
      { tone: "danger", variant: "outline", className: "border-danger/25 text-danger" },
      { tone: "gold", variant: "soft", className: "bg-brand-gold/15 text-brand-navy" },
      { tone: "gold", variant: "outline", className: "border-brand-gold/40 text-brand-navy" },
      { tone: "teal", variant: "soft", className: "bg-brand-teal/14 text-brand-teal" },
      { tone: "teal", variant: "outline", className: "border-brand-teal/25 text-brand-teal" },
    ],
    defaultVariants: {
      tone: "default",
      variant: "soft",
    },
  },
);

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, tone, variant, ...props }: BadgeProps): React.JSX.Element {
  return <span className={cn(badgeVariants({ tone, variant }), className)} {...props} />;
}
