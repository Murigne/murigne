"use client";

import { NavigationShell } from "@/components/navigation/navigation-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ErrorProps = {
  error: Error;
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps): React.JSX.Element {
  return (
    <NavigationShell>
      <Card className="murigne-card-pad">
        <p className="murigne-eyebrow text-muted-foreground">Inline error state</p>
        <h1 className="mt-2 text-2xl font-semibold text-brand-navy">Unable to render this bank profile</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Source reference note: the page keeps header context when mock payload retrieval fails, and exposes a retry
          path inside the active tab panel. {error.message}
        </p>
        <Button className="mt-6" onClick={reset} type="button">
          Retry
        </Button>
      </Card>
    </NavigationShell>
  );
}
