import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound(): React.JSX.Element {
  return (
    <main className="murigne-shell flex min-h-screen items-center justify-center">
      <div className="murigne-card-soft max-w-xl p-8 text-center">
        <p className="murigne-eyebrow">Not found</p>
        <h1 className="murigne-title mt-4 font-semibold text-brand-navy">
          This Murigne page does not exist yet.
        </h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          The design-system shell is ready, but this route has not been implemented in the current
          Phase 0 slice.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Return to the dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
