import type { Metadata } from "next";
import "./globals.css";
import "./components/public-homepage.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://babieshippo.com"),
  title: "Baby Hippo | From Worker To On-Chain Boss",
  description:
    "An on-chain growth community for ordinary people, built around education, risk management, and steady progress.",
  openGraph: {
    title: "Baby Hippo | From Worker To On-Chain Boss",
    description:
      "A Web3 education and discipline platform for hardworking people learning DCA, DeFi, and risk management.",
    url: "https://babieshippo.com",
    siteName: "Baby Hippo",
    images: [
      {
        url: "/social-preview.svg",
        width: 1200,
        height: 630,
        alt: "Baby Hippo - From Worker To On-Chain Boss",
      },
    ],
    locale: "zh_TW",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Baby Hippo | From Worker To On-Chain Boss",
    description:
      "Learn DCA, DeFi literacy, risk management, and long-term on-chain discipline with Baby Hippo.",
    images: ["/social-preview.svg"],
    creator: "@BabyHippoBHC",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
