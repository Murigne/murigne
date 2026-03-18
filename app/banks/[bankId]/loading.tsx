import { NavigationShell } from "@/components/navigation/navigation-shell";
import { Card } from "@/components/ui/card";

export default function Loading(): React.JSX.Element {
  return (
    <NavigationShell>
      <div className="space-y-6">
        <Card className="murigne-card-pad">
          <div className="murigne-skeleton h-8 w-32 rounded-md" />
          <div className="murigne-skeleton mt-4 h-12 w-80 rounded-md" />
          <div className="murigne-skeleton mt-4 h-20 w-full rounded-xl" />
        </Card>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="murigne-card-pad">
              <div className="murigne-skeleton h-5 w-24 rounded-md" />
              <div className="murigne-skeleton mt-4 h-10 w-28 rounded-md" />
              <div className="murigne-skeleton mt-4 h-6 w-40 rounded-md" />
            </Card>
          ))}
        </div>
      </div>
    </NavigationShell>
  );
}
