import type { Metadata } from "next";
import "./learn.css";

export const metadata: Metadata = {
  title: "Learn — Baby Hippo",
  description:
    "Beginner-friendly lessons about Bitcoin, Ethereum, DCA, Aave, Ether.fi, risk management, and seed phrase safety.",
};

export default function LearnLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
