import type { Metadata } from "next";
import "./globals.css";
import "./components/public-homepage.css";

export const metadata: Metadata = {
  title: "Baby Hippo | From Worker To On-Chain Boss",
  description:
    "An on-chain growth community for ordinary people, built around education, risk management, and steady progress.",
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
