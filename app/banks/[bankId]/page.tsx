import { notFound } from "next/navigation";

import { BankHeader } from "@/components/bank-profile/bank-header";
import { BankProfileTabs } from "@/components/bank-profile/bank-profile-tabs";
import { NavigationShell } from "@/components/navigation/navigation-shell";
import { getBankProfile, parseBankProfileQuery } from "@/lib/bank-profile";

type BankProfilePageProps = {
  params: Promise<{
    bankId: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BankProfilePage({
  params,
  searchParams,
}: BankProfilePageProps): Promise<React.JSX.Element> {
  const { bankId } = await params;
  const profile = getBankProfile(bankId);

  if (!profile) {
    notFound();
  }

  parseBankProfileQuery(await searchParams);

  return (
    <NavigationShell>
      <div className="space-y-6">
        <BankHeader profile={profile} />
        <BankProfileTabs profile={profile} />
      </div>
    </NavigationShell>
  );
}
