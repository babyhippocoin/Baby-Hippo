import type { Metadata } from "next";
import "./earn.css";

export const metadata: Metadata = {
  title: "Earn 2.0 — Baby Hippo",
  description:
    "A bilingual educational comparison of Ether.fi, Aave, HyperLend, and Kamino by ecosystem, use case, risk, yield source, and exit difficulty.",
};

export default function EarnLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
