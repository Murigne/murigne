import { DashboardHome } from "@/components/dashboard/dashboard-home";
import {
  bankHealthRatios,
  bankUniverseRows,
  marketOverviewCards,
  roadmapModules,
  vintageHighlights,
} from "@/lib/mock-data";

export default function HomePage(): React.JSX.Element {
  return (
    <DashboardHome
      bankRows={bankUniverseRows}
      cards={marketOverviewCards}
      modules={roadmapModules}
      ratios={bankHealthRatios}
      title="Murigne Phase 0 foundation"
      subtitle="A Next.js 15 financial data platform scaffold informed by the Murigne roadmap and the KMS dashboard language."
      vintages={vintageHighlights}
    />
  );
}
