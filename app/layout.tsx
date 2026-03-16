import type { Metadata } from "next";

import { Providers } from "@/components/providers/providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "Murigne",
  description: "Murigne financial data platform foundation scaffold.",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
