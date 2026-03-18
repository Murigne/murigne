import Link from "next/link";

import { NavigationShell } from "@/components/navigation/navigation-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HomePage(): React.JSX.Element {
  return (
    <NavigationShell>
      <Card className="murigne-card-pad">
        <p className="murigne-eyebrow text-muted-foreground">Phase 1</p>
        <h1 className="mt-2 text-3xl font-semibold text-brand-navy">Murigne bank profile preview</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Open the mocked Phase 1 bank detail route to review the bank header, CAMEL analysis,
          valuation context, and financial statement previews.
        </p>
        <Button asChild className="mt-6">
          <Link href="/banks/gcb-bank">Open GCB Bank profile</Link>
        </Button>
      </Card>
    </NavigationShell>
  );
}
