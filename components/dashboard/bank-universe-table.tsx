"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/table";
import { type BankUniverseRow } from "@/lib/mock-data";

type BankUniverseTableProps = {
  data: BankUniverseRow[];
};

const columns: ColumnDef<BankUniverseRow>[] = [
  {
    accessorKey: "bank",
    header: "Bank",
    cell: ({ row }) => (
      <div>
        <p className="font-semibold text-brand-navy">{row.original.bank}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {row.original.ticker}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "capital",
    header: "Capital",
  },
  {
    accessorKey: "earnings",
    header: "ROE",
  },
  {
    accessorKey: "liquidity",
    header: "Liquidity",
  },
  {
    accessorKey: "rating",
    header: "Murigne view",
    cell: ({ row }) => (
      <Badge tone={row.original.ratingTone} variant="soft">
        {row.original.rating}
      </Badge>
    ),
  },
];

export function BankUniverseTable({ data }: BankUniverseTableProps): React.JSX.Element {
  return <DataTable columns={columns} data={data} />;
}
